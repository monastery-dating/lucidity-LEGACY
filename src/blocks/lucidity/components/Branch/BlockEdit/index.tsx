import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import { CodeEditor } from '../../Code/CodeEditor'

const MyEditor = styled(CodeEditor)`
border-top: 2px solid #111;
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
  $blockId: typeof State.branch.$blockId
  // FIXME: replace with branch hooks for source change
  save: typeof Signal.latex.changeLatex
  // These are used by the code editor. The type
  // must be present at given path.
  source: typeof State.branch.branch.blocks.someId.source
  lang: typeof State.branch.branch.blocks.someId.lang
}

interface EProps {
  path: string
}

export const BlockEdit = connect < Props, EProps > (
  { $blockId: state`${ props`path` }.$blockId`
  , save: signal`latex.changeLatex`
  }
, function BlockEdit ( { $blockId, save, path } ) {
    const blockPath = `${ path }.branch.blocks.${ $blockId }`
    function onSave ( source: string ) {
      save ( { path: blockPath, source } )
    }
    return (
      <Wrapper>
        <MyEditor
          focus
          path={ blockPath }
          onSave={ onSave }
          />
      </Wrapper>
    )    
  }
)
