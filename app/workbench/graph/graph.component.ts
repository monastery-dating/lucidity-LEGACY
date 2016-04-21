import { Component, Inject, ChangeDetectionStrategy } from 'angular2/core'
import { BoxComponent } from '../../common/box.component'
import { stateToken, StateType } from '../../store/index'
import { dispatcherToken, DispatcherType } from '../../store/index'

import { GraphClick, GraphGhost, GraphInit } from './graph.mutations'

import { BoxDrop } from '../../interact/boxdrop.directive'
import { mockGraph } from '../../store/mock/graph'

@Component
( { selector: 'le-graph'
  , directives:
    [ BoxComponent
    , BoxDrop
    ]
  , template:
    `
    <svg id='graph' le-box-drop>
      <g (click)='doClick($event)' le-box *ngFor='#box of ( all | async )' [box]='box'></g>
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

  doClick ( event ) {
    this.dispatcher.next ( new GraphClick ( 'id3' ) )
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
