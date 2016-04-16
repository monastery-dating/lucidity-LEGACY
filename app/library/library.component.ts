import { Component, Inject, ChangeDetectionStrategy } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { UIBoxType } from '../common/uibox.type'
import { stateToken, StateType } from '../store/index'
import { dispatcherToken, DispatcherType } from '../store/index'

import { LibraryAdd, LibraryInit } from './library.mutations'

import { mockLibrary } from '../store/mock/library'

@Component
( { selector: 'le-library'
  , directives:
    [ BoxComponent
    ]
  , template:
    ` <div id='library'>
        <h3>Library</h3>

        <div class='search'>
          <p>&nbsp;
            <input value='search'>
          </p>

          <ol class='saved'>
            <li class='sel'>f</li>
            <li>g</li>
            <li>b</li>
            <li>x</li>
            <li class='add'>+</li>
          </ol>

          <ol>
            <li class='refresh' click='refreshLibrary' v-bind:class='== blink: refreshing '>refresh</li>
          </ol>
        </div>

        <ol class='results'>
          <!-- li v-if='refreshError' class='error'> ==refreshError</li -->
          <li *ngFor='#box of ( all | async )' [class]='box.className'
          style='margin-left:{{box.pos.x - 1}}px'>
            {{ box.name }}
          </li>
        </ol>

        <div class='console'>
          <p>Console
            <input value='search'>
          </p>

          <ol>
            <li class='ok'>Generated 34 cubes</li>
          </ol>
        </div>
      </div>
    `
  }
)
export class LibraryComponent {
  constructor
  ( @Inject (stateToken) private state: StateType
  , @Inject (dispatcherToken) private dispatcher: DispatcherType
  ) {
    this.dispatcher.next
    ( new LibraryInit ( mockLibrary ) )
  }

  addFile () {
    this.dispatcher.next ( new LibraryAdd ( 'Joe', 'foo') )
  }

  get all () {
    return this.state.map ( s => {
      const list = s.library.uigraph.list
      const uibox = s.library.uigraph.uibox
      return list.map ( e => uibox [ e ] )
    })
  }
  // helpers
  displayName ( uibox : UIBoxType ) : string {
    return ' '.repeat ( uibox.pos.x / 8 ) + uibox.name
  }
}
/*
<template>
</template>

<script>
import { refreshLibrary } from '../vuex/actions'

export default
{ vuex:
  { getters:
    { all ( { library } ) {
        return library.all
      }
    , refreshing ( { library } ) {
        return library.refreshing
      }
    , refreshError ( { library } ) {
        return library.error
      }
    }
  , actions:
    { refreshLibrary
    }
  }
}
</script>

<style>
</style>
*/
