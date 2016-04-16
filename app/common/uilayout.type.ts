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
, SUBPADX: 0  // (computed  = 2 * GRIDH) pad in sub assets
, SUBPADY: 4  // (computed  = 2 * GRIDH) pad in sub assets
, VPAD:   0  // vertical padding between boxes
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
  SUBPADX: number  // (3*GRIDH) pad in sub assets
  SUBPADY: number  // (3*GRIDH) pad with next item
  VPAD:   number  // vertical padding between boxes
  tsizer: any // TODO: should be a DOM element
}

export const UILayout = function
( o?: Object ) : UILayoutType {
  const res = merge ( DEFAULT_LAYOUT, o || {} )
  res.SUBPADX = 2 * res.GRIDH
  return res
}

export const defaultUILayout = UILayout ()
