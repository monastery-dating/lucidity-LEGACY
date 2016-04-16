import { Component, Inject, ChangeDetectionStrategy } from 'angular2/core'
import { BoxComponent } from '../../common/box.component'
import { stateToken, StateType } from '../../store/index'
import { dispatcherToken, DispatcherType } from '../../store/index'

import { FilesAdd, FilesInit } from './files.mutations'

import { mockFiles } from '../../store/mock/files'

@Component
( { selector: 'le-files'
  , directives:
    [ BoxComponent
    ]
  , template:
    `
    <svg id='files'>
      <g le-box *ngFor='#box of ( all | async )' [box]='box'></g>
    </svg>
    `
  , changeDetection: ChangeDetectionStrategy.OnPush
  }
)

export class FilesComponent {
  constructor
  ( @Inject (stateToken) private state: StateType
  , @Inject (dispatcherToken) private dispatcher: DispatcherType
  ) {
    this.dispatcher.next
    ( new FilesInit ( mockFiles ) )
  }

  addFile () {
    this.dispatcher.next ( new FilesAdd ( 'Joe', 'id0' ) )
  }

  get all () {
    return this.state.map ( s => {
      const list = s.files.uigraph.list
      const uibox = s.files.uigraph.uibox
      return list.map ( e => uibox [ e ] )
    })
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
