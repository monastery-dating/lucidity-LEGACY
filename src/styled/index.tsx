import * as sc from 'styled-components'
import { Theme } from './theme'
import { Col as SCol, Row as SRow } from 'react-styled-flexboxgrid'

const {
  default: styled,
  css, injectGlobal,
  keyframes,
  ThemeProvider,
  withTheme
} = sc as sc.ThemedStyledComponentsModule< Theme >

interface DimensionPropTypes {
  xs?: number | boolean
  sm?: number | boolean
  md?: number | boolean
  lg?: number | boolean
  xsOffset?: number
  smOffset?: number
  mdOffset?: number
  lgOffset?: number
}

interface ColProps extends DimensionPropTypes {
  reverse?: boolean
  tagName?: string
  theme?: Theme
  children?: React.ReactNode
}

type ColInterface = sc.StyledComponentClass<React.HTMLProps<HTMLDivElement> & ColProps, Theme>

type ModType = 'xs' | 'sm' | 'md' | 'lg'

interface RowProps {
  reverse?: boolean
  start?: ModType
  center?: ModType
  end?: ModType
  top?: ModType
  middle?: ModType
  bottom?: ModType
  around?: ModType
  between?: ModType
  first?: ModType
  last?: ModType
  tagName?: string
  theme?: Theme
  children?: React.ReactNode
}

type RowInterface = sc.StyledComponentClass<React.HTMLProps<HTMLDivElement> & RowProps, Theme>

export const Col = SCol as ColInterface
export const Row = SRow as RowInterface

export 
  { css, injectGlobal
  , keyframes, ThemeProvider, Theme
  , styled
  }
export default styled
