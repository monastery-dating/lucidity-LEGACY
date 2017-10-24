import { getSiblings } from './getSiblings'
import { makeRef } from './makeRef'
import { CompositionType, ElementRefType, StringElementType } from './types'

function positionBetween
( a: ElementRefType
, b?: ElementRefType
): number {
  if ( b ) {
    return a.elem.p + ( b.elem.p - a.elem.p ) / 2
  } else {
    return a.elem.p + 1
  }
}

export function newParagraph
( composition: CompositionType
, prev: ElementRefType
): ElementRefType {
  const siblings = getSiblings ( composition, prev.path )
  const p = positionBetween ( prev, siblings [ 1 ] )
  const elem: StringElementType = 
  { p, t: 'P', i: '' }
  const path = [ makeRef () ]
  return { path, elem }
}
