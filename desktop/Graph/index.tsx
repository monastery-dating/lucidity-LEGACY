import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { uimap, GraphType, UIGraphType } from '../../modules/Graph'
import { Node } from '../Node'

const mapUINodes =
( graph: GraphType, uigraph: UIGraphType ) => {
  const nodes = graph.nodes

  return nodes.map ( ( n ) => <Node uinode={ uigraph.uiNodeById [ n ] }/> )
}

export const Graph = Component
( { graph: [ 'scene', 'graph' ]
  , blocksById: [ 'data', 'block' ]
  }
, ( { state, signals }: ContextType ) => {
    const graph: GraphType = state.graph
    if ( graph ) {
      const uigraph = uimap ( graph, state.blocksById )

      return <svg class='Graph'>{ mapUINodes ( graph, uigraph ) }</svg>
    }
    else {
      return ''
    }
  }
)
