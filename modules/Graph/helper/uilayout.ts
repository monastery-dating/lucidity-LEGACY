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
, TPAD:   8
, BPAD:   0  // pad between siblings
, PCOUNT: 12 // palette color count
, SUBPADX: 0  // (computed  = 2 * GRIDH) pad in sub assets
, SUBPADY: 4  // (computed  = 2 * GRIDH) pad in sub assets
, VPAD:   0  // vertical padding between boxes
, tsizer: null
}

export const UILayout =
( o?: Object ) : UILayoutType => {
  const res = Object.assign ( {}, DEFAULT_LAYOUT, o || {} )
  res.SUBPADX = 2 * res.GRIDH
  if ( ! res.tsizer ) {
    res.tsizer = getTextSizeCanvas ( 'Muli 10pt' )
  }
  return res
}

export const defaultUILayout = UILayout ()
