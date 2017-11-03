import { Signal, State } from 'app'
import { connect, Component, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { CustomTagProps } from 'editor'
import { styled } from 'styled'

import { rootNodeId
       , ComponentType, GraphType, NodeByIdType, UIGraphType 
       } from '../../lib/Graph'
import { uimap } from '../../lib/Graph/helper/uimap'
import { Graph } from './Graph'
import { Library } from './Library'

export { BranchIcon } from './BranchIcon'

import './style.scss'

function classNames ( obj: any ) {
  return Object.keys ( obj ).filter ( k => obj [ k ] ).join ( ' ' )
}

interface Props {
  focused: typeof State.editor.composition.g.elem.s
  graph: typeof State.branch.graph
  drag: typeof State.branch.$drag
  drop: typeof State.branch.$drop
}

const ABranch = styled.div`
background: #eee;
margin: ${ p => p.theme.blockMargin };
border: 1px dashed orange;
min-height: 2rem;
`

const Wrapper = styled.div`
margin: 2rem;
background: #28211c;
display: flex;
flex-direction: row;
`

export const Branch = connect < Props, CustomTagProps > (
  { graph: state`${ props`dataPath` }.graph`
  , drag: state`branch.$drag`
  , drop: state`branch.$drop`
  , focused: state`${ props`path` }.s`
  }
, function Branch ( { dataPath, drop, focused, graph, path } ) {
    if ( ! graph ) {
      return null
    }

    return (
      <Wrapper>
        <Graph
          dropSlotIdx= { undefined }
          dropUINode={ undefined }
          ownerType={ 'scene' }
          path={ dataPath }
          uigraph={ uimap ( graph ) }
          />
        <Library focused={ focused !== undefined } />
      </Wrapper>
    )
  }
)