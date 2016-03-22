import Graph from '../state/graph.yml'
import Vue   from 'vue'
import Vuex  from 'vuex'
import library from './modules/library'
import { refreshLibrary } from './actions'

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

const store = new Vuex.Store
( { strict: true
  , state: baseState
  , mutations
  , modules:
    { library
    }
  }
)

refreshLibrary ( store )

export default store
