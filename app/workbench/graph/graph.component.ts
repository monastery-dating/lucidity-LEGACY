import { Component, Inject, ChangeDetectionStrategy } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { stateToken, StateType } from '../../store/index'
import { dispatcherToken, DispatcherType } from '../../store/index'

import { GraphAdd, GraphInit } from './graph.mutations'

import { mockGraph } from '../../store/mock/graph'

@Component
( { selector: 'le-graph'
  , directives:
    [ BoxComponent
    ]
  , template:
    `
    <svg id='graph'>
      <g le-box *ngFor='#box of ( all | async )' [box]='box'></g>
    </svg>
    `
  , changeDetection: ChangeDetectionStrategy.OnPush
  }
)
export class GraphComponent {
  constructor
  ( @Inject (stateToken) private state: StateType
  , @Inject (dispatcherToken) private dispatcher: DispatcherType
  ) {
    this.dispatcher.next ( new GraphInit ( mockGraph ) )
  }

  addBlock () {
    // this.dispatcher.next ( new GraphAdd ( 'Joe', 'id0' ) )
  }

  get all () {
    return this.state.map ( s => {
      const list = s.graph.uigraph.list
      const uibox = s.graph.uigraph.uibox
      return list.map ( e => uibox [ e ] )
    })
  }
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
