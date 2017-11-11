import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import { CodeEditor } from '../Code/CodeEditor'

const MyEditor = styled(CodeEditor)`
left: 2rem;
margin: 0;
position: absolute;
right: 2rem;
top: -2rem;
box-shadow: ${ p => p.theme.boxShadow }
`

const Wrapper = styled.div`
position: relative;
`

interface Props {
  onSave: typeof Signal.latex.changeLatex
  onBlur: typeof Signal.latex.toggleEdit
  // These are used by the code editor. The type
  // must be present at given path.
  source: typeof State.latex.source
  lang: typeof State.latex.lang
}

interface EProps {
  path: string
}

export const LatexEdit = connect < Props, EProps > (
  { onSave: signal`latex.changeLatex`
  , onBlur: signal`latex.toggleEdit`
  }
, function LatexEdit ( { onBlur, onSave, path } ) {
    return (
      <Wrapper>
        <MyEditor
          focus
          path={ path }
          onSave={ source => onSave ( { path, source } ) }
          onBlur={ () => {
            console.log ( 'BLUR !!' )
            onBlur ( { path } ) 
          }}
          />
      </Wrapper>
    )    
  }
)