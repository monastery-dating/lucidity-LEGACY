import { interact } from 'interact.js/interact'
import { ApplicationRef, Component, Inject, OnInit } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { uimap } from '../common/uimap'
import { UIBoxType } from '../common/uibox.type'
import { UIGraphType } from '../common/uigraph.type'
import { BoxType, initBox } from '../common/box.type'
import { GraphType } from '../common/graph.type'
import { GhostBoxType } from '../common/box.type'
import { initGraph } from '../common/graph.type'
import { rootGraphId } from '../common/graph.helper'

// FIXME: how could we move this to the GraphComponent with the
// directive setup ?
import { GraphGhost, GraphAdd } from '../workbench/graph/graph.mutations'

import { BoxDragService } from './boxdrag.service'
import { dispatcherToken, DispatcherType } from '../store/index'
import { stateToken, StateType } from '../store/index'
import { merge } from '../util/merge.util'

@Component
( { selector: 'le-boxdrag'
  , directives:
    [ BoxComponent
    ]
  , providers:
    [
    ]
  , template:
    ` <svg id='boxdrag' style='cursor:none; z-index:999; width:600px; height:60px; margin-top:-{{grabpos.y}}px; margin-left:-{{grabpos.x}}px'>
        <g le-box [uibox]='uibox'></g>
      </svg>
    `
  }
)
export class BoxDragComponent implements OnInit {
  box: BoxType
  graph: GraphType
  uibox: UIBoxType
  uigraph: UIGraphType
  grabpos: { x: number, y: number }
  ghost: any // the element under pointer


  constructor
  ( @Inject ( ApplicationRef ) private appref: ApplicationRef
  , @Inject ( BoxDragService ) private boxer: BoxDragService
  , @Inject ( stateToken ) private state: StateType
  , @Inject ( dispatcherToken ) private dispatcher: DispatcherType
  ) {
    this.boxer.setComp ( this )
    this.setBox ( initBox () )
  }

  ngOnInit () {
    this.ghost = document.getElementById ( 'boxdrag' )
    this.ghost.style.display = 'none'
  }

  registerDragable ( el: any, from?: string ) {
    const boxid = el.getAttribute ( 'data-le')
    interact ( el )
    .styleCursor ( false )
    .draggable
    ( { onstart: ( event ) => {
          // Create shadow box for dragging
          this.startDrag ( event, boxid, from || 'library', el )
        }
      , onmove: ( event ) => {
          this.move ( event )
        }
      , onend: ( event ) => {
          this.onend ( event, el )
        }
      }
    )
    .on
    ( 'down', ( event ) => {
        const int = event.interaction

        if ( !int.interacting () ) {
          int.start
          ( { name: 'drag' }
          , event.interactable
          , event.currentTarget
          )
        }
      }
    )
  }

  registerDropzone ( el: any, to: string ) {
    interact ( el )
    .styleCursor ( false )
    .dropzone
    ( { accept: '.drag'
      , ondragenter: ( event ) => {
          el.style.background = "#999"
          console.log ( 'ENTER' )
        }
      , ondropmove: ( event ) => {
          el.style.background = "#999"
          // relative position
          const p1 = event.dragEvent
          const p2 = el.getBoundingClientRect ()
          const x = p1.pageX - p2.left
          const y = p1.pageY - p2.top
          const box : BoxType = event.draggable.leBox
          const uibox : UIBoxType = event.draggable.leUIBox
          this.dispatcher.next
          ( new GraphGhost ( box, uibox, x, y ) )
          this.appref.tick ()
        }
      , ondrop: ( event ) => {
          el.style.background = ""
          this.dispatcher.next ( new GraphAdd () )
        }
      , ondragleave: ( event ) => {
          el.style.background = ""
        }
      }
    )
  }

  startDrag ( event: any, boxid: string, from: string, el: any ) {

    const box = this.getBox ( boxid, from )
    const uibox = this.setBox ( box )
    event.interactable.leBox = box
    event.interactable.leUIBox = uibox
    this.ghost.style.opacity = '0.8'
    this.ghost.style.position = 'fixed'
    this.ghost.style.top  = event.clientY
    this.ghost.style.left = event.clientX
    this.ghost.style.display = 'block'
    el.style.opacity = '0.1'
  }

  getBox ( boxid: string, from: string ) {
    const graph : GraphType = this.state.getValue ()[ from ].graph
    const box = merge ( graph.boxes [ boxid ], {} ) // copy

    box.link = null
    box.sub = null
    box.next = null

    return box
  }

  move ( event: any ) {
    this.ghost.style.top  = event.clientY // - defaultUILayout.HEIGHT / 2 + defaultUILayout.SLOT
    this.ghost.style.left = event.clientX // - defaultUILayout.RADIUS + defaultUILayout.SPAD + defaultUILayout.SLOT
  }

  onend ( event: any, el: any ) {
    document.documentElement.style.cursor = ''
    this.ghost.style.display = 'none'
    el.style.opacity = '1.0'
  }

  setBox ( box: BoxType ) : UIBoxType {
    this.box = box
    this.graph = initGraph ( this.box )
    this.uigraph = uimap ( this.graph )
    const uibox = this.uigraph.uibox [ rootGraphId ]
    this.uibox = uibox
    this.grabpos = this.uigraph.grabpos
    // FIXME: We do a full app redraw instead of just this element and children.
    this.appref.tick ()
    return uibox
  }
}
