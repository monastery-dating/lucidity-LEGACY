import { ChangeDetectionStrategy, Component, Inject } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { dispatcherToken, DispatcherType } from '../store/index'
import { stateToken, StateType } from '../store/index'
import { LibraryAdd, LibraryInit } from './library.mutations'
import { LibraryStoreType } from './library.store.type'
import { mockLibrary } from '../store/mock/library'
// import { Interact, InteractService } from '../interact/interact.service'
import { BoxDrag } from '../interact/boxdrag.directive'
import { UIBoxType } from '../common/uibox.type'

@Component
( { selector: 'le-library'
  , changeDetection: ChangeDetectionStrategy.OnPush
  , directives:
    [ BoxComponent
    , BoxDrag
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

          <div>
            <div class='refresh' click='refreshLibrary' v-bind:class='== blink: refreshing '>refresh</div>
          </div>
        </div>

        <div class='results'>
          <div>
            <!-- li v-if='refreshError' class='error'> ==refreshError</li -->
            <div class='li' *ngFor='#box of ( all | async )'
            class='li {{canDrag ( box )}} {{box.className}}'
            [attr.data-le]='box.id'
            le-box-drag
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
  // , @Inject (InteractService) private interactService: InteractService
  ) {
    /*
    interactService.setOptions
    ( 'library'
    , { draggable:
        { dragmove: ( e ) => {
            console.log ( e.clientX0 )
          }
        }
      }
    )
    */
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

  canDrag ( box : UIBoxType ) : string {
    return box.type === 'Block' ? 'drag' : ''
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
