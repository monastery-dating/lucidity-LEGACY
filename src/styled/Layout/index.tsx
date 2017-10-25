import { State } from 'app'
import { connect, JSX } from 'builder'
import { state } from 'cerebral/tags'
import { Grid } from 'react-styled-flexboxgrid'
import { styled, Theme, ThemeProvider } from 'styled'

import { theme } from 'config/themes'
import './style.scss'

const flextheme = ( theme: Theme ) => Object.assign
( {}
, { flexboxgrid:
      // Defaults
    { gutterWidth: 0 // rem
    , outerMargin: 2 // rem
    , container:
      { sm: 56 // rem
      , md: 61 // rem
      , lg: 76  // rem
      } 
    , breakpoints:
      { xs: 0  // em
      , sm: 58 // em
      , md: 64 // em
      , lg: 75  // em
      }
    }
  }
, theme
)

const MyGrid = Grid.extend`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

interface EProps {
  className?: string
}

const Wrapper = styled.div`
  font-family: ${ ( props: any ) => props.theme.fontFamily };
  background: ${ props => props.theme.background };
  color: ${ props => props.theme.color }
`

interface Props {
  theme: Theme
}

export const Layout = connect < Props, EProps > (
  { theme
  }
, function Layout ( { children, className, theme } ) {
    return (
      <ThemeProvider theme={ flextheme ( theme ) }>
        <Wrapper>
          <MyGrid className={ className }>
            { children }
          </MyGrid>
        </Wrapper>
      </ThemeProvider>
    )
  }
)
