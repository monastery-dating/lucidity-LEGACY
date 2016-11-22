import fuse from './fuse'
import getAtPath from './getAtPath'
import getSiblings from './getSiblings'
import inSelection from './inSelection'
import makeRef from './makeRef'
import resetPosition from './resetPosition'
import splitText from './splitText'

const PARTS = ['before', 'inside', 'after']

const applyOp = (list, type) => {
  const newlist = []
  list.forEach(({elem, ref}, idx) => {
    let t
    if (elem.t !== 'T' && elem.t !== type) {
      t = [elem.t, type].sort((a, b) => a > b ? 1 : -1).join('+')
    } else {
      t = type
    }
    const nextobj = list[idx + 1]
    if (nextobj) {
      if (elem.t === t && nextobj.elem.t === 'T') {
        // Fuse nextobj with elem
        list[idx + 1] = {
          ref,
          // Fuse elem + next
          elem: fuse(elem, nextobj.elem)
        }
        return
      } else if (elem.t === 'T' && nextobj.elem.t === t) {
        list[idx + 1] = {
          ref: nextobj.ref,
          // Fuse elem + next as next
          elem: fuse(elem, nextobj.elem, nextobj.elem)
        }
        return
      }
    }
    newlist.push({
      ref,
      elem: Object.assign({}, elem, {t})
    })
  })
  return newlist
}

const splitElement = (elem, ref, startOffset, endOffset, startP, afterP) => {
  const splitParts = splitText(elem.i, startOffset || 0, endOffset || elem.i.length)
  const result = {}

  let position = startP
  const increment = afterP ? (afterP - position) / 4 : 1

  PARTS.forEach(key => {
    const text = splitParts[key]
    if (text.length > 0) {
      result[key] = [{
        ref: (!ref || key === 'inside') ? makeRef() : ref,
        elem: {p: position, t: 'T', i: text}
      }]
      position += increment
    }
  })
  return result
}

const processSingleParent = (composition, {anchorOffset, focusOffset}, touched, op) => {
  let changedPath
  let changedElem
  let parts
  let children = {}
  const {path, elem} = touched[0]
  if (touched.length === 1 && path.length === 1) {
    // Raw paragraph
    changedPath = path
    changedElem = elem
    parts = splitElement(elem, null, anchorOffset, focusOffset, 0)
  } else {
    // Parent is changed
    changedPath = path.slice(0, -1)
    const parent = getAtPath(composition, changedPath)
    children = Object.assign({}, parent.i)
    changedElem = parent
    if (touched.length === 1) {
      const siblings = getSiblings(composition, path)
      const afterP = siblings[1] ? siblings[1].elem.p : null
      const ref = path[path.length - 1]
      parts = splitElement(elem, ref, anchorOffset, focusOffset, elem.p, afterP)
    } else {
      // Multiple elements
      parts = {}
      touched.forEach(({elem, path}, idx) => {
        const ref = path[path.length - 1]
        if (idx === 0) {
          // handle first
          const afterElem = touched[1].elem
          const startParts = splitElement(elem, ref, anchorOffset, null, elem.p, afterElem.p)
          parts.before = startParts.before
          parts.inside = startParts.inside
        } else if (idx === touched.length - 1) {
          // handle last
          const siblings = getSiblings(composition, path)
          const afterP = siblings[1] ? siblings[1].elem.p : null
          const endParts = splitElement(elem, ref, null, focusOffset, elem.p, afterP)
          parts.after = endParts.after
          parts.inside = parts.inside.concat(endParts.inside)
        } else {
          parts.inside.push({
            ref,
            elem
          })
        }
      })
    }
  }

  if (op) {
    parts.inside = applyOp(parts.inside, op)
  }

  Object.keys(parts).forEach(key => {
    parts[key].forEach(({elem, ref}) => {
      children[ref] = elem
    })
  })

  children = resetPosition(children)

  const changes = {
    updated: [{
      path: changedPath,
      elem: Object.assign({}, changedElem, {i: children})
    }]
  }

  const inside = parts.inside
  if (inside) {
    changes.selected = parts.inside.map(({ref}) => ({
      path: changedPath.concat([ref]),
      elem: children[ref]
    }))
  }
  return changes
}

const hasSameParent = (list) => {
  const parentPath = list[0].path.slice(0, -1).join('.')
  for (const l of list) {
    if (l === list[0]) {
      continue
    }
    if (l.path.slice(0, -1).join('.') !== parentPath) {
      return false
    }
  }
  return true
}

/** Given a composition and a selection, returns the
 * extracted elements in the selection in 'selected'.
 * In 'updated', returns changed elements.
 * Operations must first alter 'selected' in place and then
 * process 'updated'.
 */
export default function extractSelection (composition, selection, op) {
  const touched = inSelection(composition, selection)
  if (touched.length === 1 || hasSameParent(touched)) {
    return processSingleParent(composition, selection, touched, op)
  } else {
    // Start and end have different parent.
  }
}
