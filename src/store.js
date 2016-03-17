import Graph from './state/graph.yml'
import Vue   from 'Vue'
import Vuex  from 'Vuex'

Vue.use ( Vuex )

export default new Vuex.Store
( { state:
    { title: 'Lucy in the sky'
    , graph: Graph
    }
  , mutations:
    { foo ( state ) {
        state.title = 'foo'
      }
    }
  }
)

// export default store
