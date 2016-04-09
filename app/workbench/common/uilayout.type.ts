import { merge } from '../util/index'

/** Some constants for graph layout. These could live in a settings object when
 * calling boxLayout and path.
 */
const DEFAULT_LAYOUT =
{ GRIDH:  8
, HEIGHT: 30
, RADIUS: 5
, SLOT:   5
, SPAD:   16
, TPAD:   10
, BPAD:   0  // pad between siblings
, PCOUNT: 12 // palette color count
, SUBPAD: 3 * 8 // (3*GRIDH) pad in sub assets
, VPAD:   3  // vertical padding between boxes
, tsizer: document.getElementById ( 'tsizer' )
}

export interface UILayoutType {
  GRIDH:  number
  HEIGHT: number
  RADIUS: number
  SLOT:   number
  SPAD:   number
  TPAD:   number
  BPAD:   number  // pad between siblings
  PCOUNT: number  // palette color count
  SUBPAD: number  // (3*GRIDH) pad in sub assets
  VPAD:   number  // vertical padding between boxes
  tsizer: any // TODO: should be a DOM element
}

export const UILayout = function
( o?: Object ) : UILayoutType {
  const res = merge ( DEFAULT_LAYOUT, o || {} )
  res.SUBPAD = 3 * res.GRIDH
  return res
}

export const defaultUILayout = UILayout ()
