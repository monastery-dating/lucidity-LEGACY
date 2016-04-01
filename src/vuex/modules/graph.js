import
{ DEFAULT_LAYOUT
, boxLayout
} from '../../components/boxDraw.js'

/*
import
{
} from '../mutation-types'
*/

import Graph from '../../state/graph.yml'

// initial state
const bdefs = {}
boxLayout ( Graph.graph, 'g0', DEFAULT_LAYOUT, bdefs, null )

const state =
{ graph: Graph.graph
, bdefs
}

// mutations
const mutations =
{
}

export default
{ state
, mutations
}


