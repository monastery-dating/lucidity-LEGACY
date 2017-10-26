import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import { CodeEditor } from '../Code/CodeEditor'

const MyEditor = styled(CodeEditor)`
margin-top: -2rem;
`

interface Props {
  latex: typeof State.latex.code 
  onChange: typeof Signal.latex.changeLatex
}

interface EProps {
  path: string
}

export const LatexEdit = connect < Props, EProps > (
  { onChange: signal`latex.changeLatex`
  }
, function LatexEdit ( { onChange, path } ) {
    const save = ( code: string ) => {
      onChange ( { path, code } )
    }
    return (
      <MyEditor
        path={ path }
        save={ save }
        />
    )    
  }
)