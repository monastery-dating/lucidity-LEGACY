import { GetTextSizeType } from './getTextSize.type'

export interface UILayoutType {
  GRIDH:  number
  HEIGHT: number
  THEIGHT: number // text height (should be changed if font changes)
  RADIUS: number
  SLOT:   number
  SPAD:   number
  TPAD:   number
  BPAD:   number  // pad between siblings
  PCOUNT: number  // palette color count
  SUBPADX: number  // (3*GRIDH) pad in sub assets
  SUBPADY: number  // (3*GRIDH) pad with next item
  VPAD:   number  // vertical padding between boxes
  tsizer: GetTextSizeType
}
