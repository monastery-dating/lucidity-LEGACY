import Vue   from 'vue'
import Vuex  from 'vuex'
import files from './modules/files'
import graph from './modules/graph'
import library from './modules/library'
import { refreshLibrary } from './actions'

Vue.use ( Vuex )

const baseState =
{ title: 'Lucy in the sky'
}

const store = new Vuex.Store
( { strict: true
  , state: baseState
  , modules:
    { library
    , files
    , graph
    }
  }
)

refreshLibrary ( store )

export default store
