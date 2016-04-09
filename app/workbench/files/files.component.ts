import { Component, Inject, ChangeDetectionStrategy } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { stateToken, StateType } from '../../store/index'
import { dispatcherToken, DispatcherType } from '../../store/index'

@Component
( { selector: 'le-files'
  , directives:
    [ BoxComponent
    ]
  , template:
    `
     {{ filesCount | async }}

     <svg id='files' v-drop:box>
        <le-box v-for='item in all'
          box='==boxdef [ item ]'
          ></le-box>
      </svg>
    `
  , changeDetection: ChangeDetectionStrategy.OnPush
  }
)

export class FilesComponent {
  constructor
  ( @Inject (stateToken) private state: StateType
  , @Inject (dispatcherToken) private dispatcher: DispatcherType
  ) { }

  addFile () {
    // this.dispatcher.next ( new FilesAdd ( ... ) )
  }

  get filesCount () {
    return this.state.map ( s => s.files.uigraph.list.length )
  }
}
/*
<template>
</template>

<script>
import Box from './Box'
import { filesAdd } from '../vuex/actions'

// const ainfo = {}
// computeSize ( Snap ( '#scrap' ), files, ainfo, 'f0' )
// drawOne ( snap ( '#files' ), files,  ainfo, 'f0', { x: 0, y: 0 } )

export default
{ vuex:
  { getters:
    { all ( { files } ) {
        return files.all
      }
    , boxdef ( { files } ) {
        return files.boxdef
      }
    }
  , actions:
    { drop: filesAdd
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
