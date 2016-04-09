import { Component } from 'angular2/core'
import { BoxComponent } from '../common/box.component'

@Component
( { selector: 'le-graph'
  , directives:
    [ BoxComponent
    ]
  , template:
    ` <svg id='graph'>
        <box v-for='item in all'
          box='==boxdef [ item ]'
          ></box>
      </svg>
    `
  }
)
export class GraphComponent {

}
/*
import Box from './Box'

export default
{ vuex:
  { getters:
    { all ( { graph } ) {
        return graph.all
      }
    , boxdef ( { graph } ) {
        return graph.boxdef
      }
    }
  , actions:
    {
    }
  }
, methods: {}
, components:
  { Box }
}
</script>

<style>
</style>
*/
