import Graph from '../state/graph.yml'
import Vue   from 'vue'
import Vuex  from 'vuex'
import files from './modules/files'
import library from './modules/library'
import { refreshLibrary } from './actions'

Vue.use ( Vuex )

const baseState =
{ title: 'Lucy in the sky'
, graph: Graph.graph
}

const store = new Vuex.Store
( { strict: true
  , state: baseState
  , modules:
    { library
    , files
    }
  }
)

refreshLibrary ( store )

export default store
