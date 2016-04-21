import { GraphType, BoxesType } from '../common/graph.type'
import { merge } from '../util/merge.util'

export const nextGraphId = function
( graph : GraphType
) : string {
  const boxes = graph.boxes
  let n : number = 0
  while ( boxes [ `id${n}` ] ) {
    n += 1
  }
  return `id${n}`
}

export const rootGraphId = nextGraphId ( <GraphType> { boxes: {}} )

const collectGraph = function
( boxes: BoxesType
, curid: string
, boxid: string
, newboxes: BoxesType
) {
  if ( curid === boxid ) {
    return // ignore element and children
  }

  const elem = boxes [ curid ]
  if ( !elem ) {
    return
  }

  // check 'boxid' is not referenced inside this element

  // follow next, sub, link
  const link = elem.link
  const newlink = []
  const changes = {}
  let changed = false
  if ( elem.link ) {
    for ( const k of elem.link ) {
      if ( k === boxid ) {
        changes['link'] = newlink
        changed = true
      }
      else {
        newlink.push ( k )
        collectGraph ( boxes, k, boxid, newboxes )
      }
    }
  }
  if ( elem.next === boxid ) {
    changes['next'] = null
    changed = true
  }
  else {
    collectGraph ( boxes, elem.next, boxid, newboxes )
  }
  if ( elem.sub === boxid ) {
    changes['sub'] = null
    changed = true
  }
  else {
    collectGraph ( boxes, elem.sub, boxid, newboxes )
  }
  if ( changed ) {
    newboxes [ curid ] = merge ( elem, changes )
  }
  else {
    newboxes [ curid ] = elem
  }
}

export const removeInGraph = function
( graph : GraphType
, boxid : string
) : GraphType {
  const newgraph : GraphType = { type: graph.type, boxes: {} }
  collectGraph ( graph.boxes, rootGraphId, boxid, newgraph.boxes )
  return newgraph
}
