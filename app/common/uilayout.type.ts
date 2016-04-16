import { merge } from '../util/index'

/** Some constants for graph layout. These could live in a settings object when
 * calling boxLayout and path.
 */
const DEFAULT_LAYOUT =
{ GRIDH:  6
, HEIGHT: 26
, RADIUS: 5
, SLOT:   5
, SPAD:   16 // slot pad
, TPAD:   8
, BPAD:   0  // pad between siblings
, PCOUNT: 12 // palette color count
, SUBPAD: 0  // (computed  = 2 * GRIDH) pad in sub assets
, VPAD:   2  // vertical padding between boxes
, tsizer: null
}

// FIXME how to do this properly ?
export const getTsizer = function () {
  if ( !DEFAULT_LAYOUT.tsizer ) {
    DEFAULT_LAYOUT.tsizer = document.getElementById ( 'tsizer' )
    if ( !DEFAULT_LAYOUT.tsizer ) {
      console.log ( 'svg element tsizer missing in page' )
    }
    defaultUILayout.tsizer = DEFAULT_LAYOUT.tsizer
  }
  return DEFAULT_LAYOUT.tsizer
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
  res.SUBPAD = 2 * res.GRIDH
  return res
}

export const defaultUILayout = UILayout ()
