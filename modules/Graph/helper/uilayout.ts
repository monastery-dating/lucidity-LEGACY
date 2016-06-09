import { UILayoutType } from '../types'
import { getTextSizeCanvas } from './getTextSizeCanvas'

/** Some constants for graph layout.
 * These could live in a settings object when
 * calling boxLayout and path.
 */
const DEFAULT_LAYOUT =
{ GRIDH:  6
, HEIGHT: 26
, THEIGHT: 20
, RADIUS: 5
, SLOT:   5
, SPAD:   16 // slot pad
, SCLICKW:  0 // (computed from SLOT and SPAD ) slot click rect width
, SCLICKH:  0 // (computed from HEIGHT) slot click rect height
, TPAD:   8
, BPAD:   0  // pad between siblings
, PCOUNT: 8 // palette color count must be the same as _palettee.scss
, SUBPADX: 0  // (computed  = 2 * GRIDH) pad in sub assets
, SUBPADY: 4  // (computed  = 2 * GRIDH) pad in sub assets
, VPAD:   0  // vertical padding between boxes
, tsizer: null
}

export const UILayout =
( o?: Object ) : UILayoutType => {
  const res = Object.assign ( {}, DEFAULT_LAYOUT, o || {} )
  res.SUBPADX = 2 * res.GRIDH
  res.SCLICKW = res.SPAD + 2 * res.SLOT
  res.SCLICKH = 1.2 * res.HEIGHT
  if ( ! res.tsizer ) {
    res.tsizer = getTextSizeCanvas ( '10pt Avenir Next' )
  }
  return res
}

export const defaultUILayout = UILayout ()
