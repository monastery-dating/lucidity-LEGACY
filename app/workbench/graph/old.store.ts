import
{ DEFAULT_LAYOUT
, boxLayout
} from '../../lib/boxDraw.js'

/*
import
{
} from '../mutation-types'
*/

import Graph from '../../state/graph.yml'

// initial state
const bdefs = {}
boxLayout ( Graph, 'g0', DEFAULT_LAYOUT, bdefs, null )

const state =
{ graph: Graph
, all: bdefs.all
, boxdef: bdefs.boxdef
}

// mutations
const mutations =
{
}

export default
{ state
, mutations
}
