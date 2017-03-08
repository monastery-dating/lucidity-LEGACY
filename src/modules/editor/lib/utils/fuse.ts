import { joinText } from './joinText'
import { ElementType, GroupElementType, StringElementType } from './types'

export function fuse
( a: StringElementType
, b: StringElementType
, c?: ElementType
): GroupElementType {
  return Object.assign
  ( {}
  , <GroupElementType> ( c || a ) // TS cannot figure out that 'i' will be replaced
  , { i: joinText ( a.i, b.i ) }
  )
}
