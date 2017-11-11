import { Signal, State } from 'app'
import { connect, Component, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { CustomTagProps } from 'editor'
import { styled } from 'styled'

import { ComponentType, GraphType, NodeByIdType, UIGraphType 
       } from '../../lib/Graph'
import { BlockEdit } from './BlockEdit'
export { BranchIcon } from './BranchIcon'
import { Graph } from './Graph'
import { Library } from './Library'

import './style.scss'

function classNames ( obj: any ) {
  return Object.keys ( obj ).filter ( k => obj [ k ] ).join ( ' ' )
}

interface Props {
  focused: typeof State.editor.composition.g.elem.s
  $blockId: typeof State.branch.$blockId
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
`

export const Branch = connect < Props, CustomTagProps > (
  { drag: state`branch.$drag`
  , drop: state`branch.$drop`
  , $blockId: state`${ props`path` }.$blockId`
  , focused: state`${ props`path` }.s`
  }
, function Branch ( { path, drop, $blockId, focused } ) {
    return (
      <div>
        <Wrapper>
          <Graph
            dropSlotIdx= { undefined }
            dropUINode={ undefined }
            path={ path }
            />
          <Library focused={ focused !== undefined } />
        </Wrapper>
          { $blockId
            ? <BlockEdit path={ path } />
            : null
          }
      </div>
    )
  }
)