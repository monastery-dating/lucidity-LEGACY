import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { uimap, GraphType, UIGraphType } from '../../modules/Graph'
import { Node } from '../Node'
import { SceneType } from '../../modules/Scene'
import { ProjectType } from '../../modules/Project'

const mapUINodes =
( graph: GraphType
, uigraph: UIGraphType
, ownerType: string
) => {
  const nodes = graph.nodes

  return nodes.map ( ( n ) => <Node uinode={ uigraph.uiNodeById [ n ] } ownerType={ ownerType }/> )
}

export const Graph = Component
( { blocksById: [ 'data', 'block' ]
  }
, ( { props, state, signals }: ContextType ) => {
    const ownerType = props.ownerType
    const graph: GraphType = props.graph
    if ( graph ) {
      // Could we get rid of blocksById dependency ? Or just
      // pass the required elements from 'scene' to avoid redraw if
      // any existing block changes ?
      const uigraph = uimap ( graph, state.blocksById )

      return <svg class='Graph'>{ mapUINodes ( graph, uigraph, ownerType ) }</svg>
    }
    else {
      return ''
    }
  }
)
