import { interact } from 'interact.js/interact.js'
import { ApplicationRef, Component, Inject, OnInit } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { uimap } from '../common/uimap'
import { UIBoxType } from '../common/uibox.type'
import { UIGraphType } from '../common/uigraph.type'
import { BoxType, initBox } from '../common/box.type'
import { GraphType } from '../common/graph.type'
import { initGraph } from '../common/graph.type'
import { rootGraphId } from '../common/graph.helper'

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
        <g le-box [box]='uibox'></g>
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
  ghost: any

  constructor
  ( @Inject ( ApplicationRef ) private appref: ApplicationRef
  , @Inject ( BoxDragService ) private boxer: BoxDragService
  , @Inject (stateToken) private state: StateType
  , @Inject (dispatcherToken) private dispatcher: DispatcherType
  ) {
    this.boxer.setComp ( this )
    this.setBox ( initBox () )
  }

  ngOnInit () {
    this.ghost = document.getElementById ( 'boxdrag' )
    this.ghost.style.display = 'none'
  }

  register ( el: any, boxid: string, from?: string ) {
    // Register mouse events
    interact ( el )
    .styleCursor ( false )
    .draggable
    ( { onstart: ( event ) => {
          // Create shadow box for dragging
          this.startDrag ( event, boxid, from || 'library' )
        }
      , onmove: ( event ) => {
          this.move ( event )
        }
      , onend: ( event ) => {
          this.onend ( event )
        }
      }
    )
  }

  startDrag ( event: any, boxid: string, from: string ) {
    const graph : GraphType = this.state.getValue ()[ from ].graph
    const box = merge ( graph.boxes [ boxid ], {} ) // copy

    box.link = null
    box.sub = null
    box.next = null

    this.setBox ( box )
    this.ghost.style.opacity = '0.8'
    this.ghost.style.position = 'fixed'
    // FIXME: How could we get 'outpos' ?
    this.ghost.style.top  = event.clientY // - defaultUILayout.HEIGHT / 2 + defaultUILayout.SLOT
    this.ghost.style.left = event.clientX // - defaultUILayout.RADIUS + defaultUILayout.SPAD + defaultUILayout.SLOT
    this.ghost.style.display = 'block'
  }

  move ( event: any ) {
    this.ghost.style.top  = event.clientY // - defaultUILayout.HEIGHT / 2 + defaultUILayout.SLOT
    this.ghost.style.left = event.clientX // - defaultUILayout.RADIUS + defaultUILayout.SPAD + defaultUILayout.SLOT
  }

  onend ( event: any ) {
    document.documentElement.style.cursor = ''
    this.ghost.style.display = 'none'
  }

  setBox ( box: BoxType ) {
    this.box = box
    this.graph = initGraph ( this.box )
    this.uigraph = uimap ( this.graph )
    const uibox = this.uigraph.uibox [ rootGraphId ]
    this.uibox = uibox
    this.grabpos = this.uibox.grabpos
    // FIXME: We do a full app redraw instead of just this element and children.
    this.appref.tick ()
  }
}
