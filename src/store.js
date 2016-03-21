import Graph from './state/graph.yml'
import Vue   from 'Vue'
import Vuex  from 'Vuex'

Vue.use ( Vuex )

const baseState =
{ title: 'Lucy in the sky'
, graph: Graph.graph
, files: Graph.files
}

const mutations =
{ foo ( state ) {
    state.graph.g1.sel = true
  }
}

export default new Vuex.Store
( { state: baseState
  , mutations
  }
)

// export default store
