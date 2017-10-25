export interface Theme {
  color: string
  background: string
  // block is for text, paragraph, label
  // We use block margin instead of box padding
  blockMargin: string
  // Not all blocks use the padding (input does)
  blockPaddingH: number // in rem
  blockPaddingV: number // in rem
  // For Card and such
  border: string
  borderRadius: number
  boxShadow: string
  errorColor: string
  fontFamily: string
  inputColor: string
  pagePadding: number
  // Fixed Page width. Available = pageWidth - pagePadding
  pageWidth: number
  primaryColorFg: string
  primaryColor: string
  regionPadding: string
  secondaryColor: string
  secondaryColorFg: string
}
