import { ChangeDetectionStrategy, Component, Inject } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { dispatcherToken, DispatcherType } from '../store/index'
import { stateToken, StateType } from '../store/index'
import { LibraryAdd, LibraryInit } from './library.mutations'
import { LibraryStoreType } from './library.store.t'
import { mockLibrary } from '../store/mock/library'
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula'
import { UIBoxType } from '../common/uibox.type'


@Component
( { selector: 'le-library'
  , directives:
    [ BoxComponent
    , Dragula
    ]
  , viewProviders:
    [ DragulaService ]
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

          <div>
            <div class='refresh' click='refreshLibrary' v-bind:class='== blink: refreshing '>refresh</div>
          </div>
        </div>

        <div class='results'>
          <div [dragula]='library'>
            <!-- li v-if='refreshError' class='error'> ==refreshError</li -->
            <div class='li' *ngFor='#box of ( all | async )'
            class='li {{box.className}}'
            [attr.data-le]='box.id'
            style='margin-left:{{box.pos.x - 1}}px'>
              <span>{{ box.name }}</span>
            </div>
          </div>
        </div>

        <div class='console'>
          <p>Console
            <input value='search'>
          </p>

          <div>
            <div class='li ok'><span>Generated 34 cubes</span></div>
          </div>
        </div>
      </div>
    `
  }
)
export class LibraryComponent {
  constructor
  ( @Inject (stateToken) private state: StateType
  , @Inject (dispatcherToken) private dispatcher: DispatcherType
  , @Inject (DragulaService) private dragulaService: DragulaService
  ) {
    console.log ( dragulaService )
    dragulaService.setOptions
    ( 'library'
    , { copy: true
      , moves: function ( el, container, handle ) {
          const boxid = el.getAttribute ( 'data-le' )
          const lib : LibraryStoreType = this.state.library
          const box = lib.graph.boxes [ boxid ]
          console.log ( box.name )
          return ! box.sub
        }
    }
    )
    dispatcher.next
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
