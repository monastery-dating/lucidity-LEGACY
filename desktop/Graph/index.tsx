import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { uimap, GraphWithBlocksType, UIGraphType } from '../../modules/Graph'
import { Node } from '../Node'

const mapUINodes =
( graph: GraphWithBlocksType, uigraph: UIGraphType ) => {
  const nodes = graph.nodes

  return nodes.map ( ( n ) => <Node uinode={ uigraph.uiNodeById [ n ] }/> )
}

export const Graph = Component
( { graph: [ 'graph' ]
  }
, ( { state, signals }: ContextType ) => {
    const graph: GraphWithBlocksType = state.graph
    const uigraph = uimap ( graph )

    return <svg class='Graph'>{ mapUINodes ( graph, uigraph ) }</svg>
  }
)
