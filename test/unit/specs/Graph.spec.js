// https://vuejs.github.io/vue-loader/workflow/testing.html
import Graph from 'src/components/Graph'
import Vue from 'vue'

describe
( 'Graph.vue'
, () => {
    it
    ( 'should render correct contents'
    , () => {
        const vm = new Vue
        ( { template: '<div><graph></graph></div>'
          , components: { Graph }
          }
        )
        .$mount ()

        expect
        ( vm.$el.querySelector ( '.hello h1' ).textContent )
        .toBe ( 'Hello World!' )
      }
    )
  }
)

