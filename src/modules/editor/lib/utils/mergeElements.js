import joinText from './joinText'
import makeRef from './makeRef'
import canFuse from './canFuse'
import fuse from './fuse'

const addDepth = (a) => Object.assign(
  {}, a,
  { i: {
    [makeRef()]: {
      p: 0,
      t: 'T',
      i: a.i
    }
  }}
)
// Note that target === last element in para (can be para itself)
// and that source === first element in para (can be para itself)
const moveInPara = (composition, targetName, source, ref, lastPosition, ops) => {
  const targetPath = [targetName]
  const target = composition.i[targetName]

  if (typeof target.i === 'string') {
    // No children, make first
    ops.push({
      op: 'update',
      path: targetPath,
      value: addDepth(target)
    })
    lastPosition = 0
  }

  const t = source.t === 'P' ? 'T' : source.t
  ops.push({
    op: 'update',
    path: targetPath.concat([ref]),
    value: Object.assign({}, source, {p: ++lastPosition, t})
  })
  return lastPosition
}

const mergeFlatEnd = (composition, start, end, ops) => {
  const hasDelete = ops.length > 0
  if (hasDelete) {
    // Remove end.update
    ops.pop()
  }
  // End is just a simple paragraph, simply fuse or move in start para.
  if (canFuse(start, end)) {
    ops.push({
      op: 'update',
      path: start.path,
      value: fuse(start.elem, end.elem)
    })
    if (hasDelete) {
      // Remove start.update
      ops.shift()
    } else {
      ops.push({
        op: 'select',
        path: start.path,
        offset: start.elem.i.length
      })
    }
  } else {
    const parentRef = start.path[0]
    const ref = end.path[end.path.length - 1]
    moveInPara(composition, parentRef, end.elem, ref, start.elem.p, ops)
    if (!hasDelete) {
      ops.push({
        op: 'select',
        path: [parentRef, ref],
        offset: 0
      })
    }
  }
  ops.push({op: 'delete', path: end.path})
}

const mergeSamePara = (composition, start, end, ops) => {
  const hasDelete = ops.length > 0
  // start and end are in same paragraph. Fuse if possible or
  // leave as is.
  if (canFuse(start, end)) {
    if (hasDelete) {
      // Remove start.update and end.update
      ops.shift()
      ops.pop()
    }

    const parent = composition.i[start.path[0]]
    let minPos = Infinity
    let maxPos = -1
    Object.keys(parent.i).forEach(ref => {
      const p = parent.i[ref].p
      if (p < minPos) {
        minPos = p
      }
      if (p > maxPos) {
        maxPos = p
      }
    })
    if (start.elem.p === minPos && end.elem.p === maxPos) {
      // fuse in parent
      const path = start.path.slice(0, 1)
      if (hasDelete) {
        ops.length = 0
      }
      ops.push({
        op: 'update',
        path,
        value: fuse(start.elem, end.elem, parent)
      })
      ops.push({
        op: 'select',
        path,
        offset: start.elem.i.length
      })
    } else {
      // fuse in start
      ops.push({
        op: 'update',
        path: start.path,
        value: fuse(start.elem, end.elem)
      })
      ops.push({op: 'delete', path: end.path})
    }
  }
}

const mergeTwoPara = (composition, start, end, ops) => {
  const hasDelete = ops.length > 0
  if (hasDelete) {
    ops.pop()
  }
  // Move each element from end para inside start para.
  // Make sure to move updated 'end' block
  let lastPosition = start.elem.p
  const endParaPath = end.path.slice(0, 1)
  const children = composition.i[endParaPath[0]].i
  let skip = true
  const endRef = end.path[1]
  Object.keys(children)
  .sort((a, b) => children[a].p > children[b].p ? 1 : -1)
  .forEach((ref, idx) => {
    let elem = children[ref]
    if (ref === endRef) {
      if (canFuse(start, end)) {
        ops.push({
          op: 'update',
          path: start.path,
          value: fuse(start.elem, end.elem)
        })
        if (hasDelete) {
          // Remove start update
          ops.shift()
        } else {
          // Add select
          ops.push({
            op: 'select',
            path: start.path,
            offset: start.elem.i.length
          })
        }
        skip = false
        return
      } else if (end.path.length === 2) {
        elem = end.elem
      } else {
        // Need to write 'end' update inside elem (it's parent)
        elem = Object.assign({}, elem, {i: Object.assign(
          {},
          elem.i,
          {[end.path[end.path.length - 1]]: end.elem}
        )})
      }
      // Stop skipping
      skip = false
    } else if (skip) {
      // deleted, ignore
      return
    }
    lastPosition = moveInPara(
      composition, start.path[0], elem, ref, lastPosition, ops)
  })
  ops.push({op: 'delete', path: end.path.slice(0, 1)})
}

export default function mergeElements (composition, start, end, ops = []) {
  if (end.path.length === 1) {
    mergeFlatEnd(composition, start, end, ops)
  } else if (start.path[0] === end.path[0]) {
    mergeSamePara(composition, start, end, ops)
  } else {
    mergeTwoPara(composition, start, end, ops)
  }
  return ops.length === 0 ? null : ops
}
