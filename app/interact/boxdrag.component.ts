import { Component, Inject, OnInit } from 'angular2/core'
import { BoxComponent } from '../common/box.component'
import { uimap } from '../common/uimap'
import { UIBoxType } from '../common/uibox.type'
import { UIGraphType } from '../common/uigraph.type'
import { BoxType } from '../common/box.type'
import { GraphType } from '../common/graph.type'
import { initGraph } from '../common/graph.type'
import { rootGraphId } from '../common/graph.helper'

import { Test2Component } from '../test2.component'

import { BoxDragService } from './boxdrag.service'
import { Subscription } from 'rxjs'

@Component
( { selector: 'le-boxdrag'
  , directives:
    [ BoxComponent
    , Test2Component
    ]
  , providers:
    [
    ]
  , template:
    ` <svg id='boxdrag' style='z-index:999; width:600px; height:60px; margin-top:-{{grabpos.y}}px; margin-left:-{{grabpos.x}}px'>
        <g le-box [box]='uibox'></g>
      </svg>
      <div style='border:1px solid blue; margin:30px;'>
        <button (click)='change()'>foo</button>
        <le-test2 [name]='aname'></le-test2>
      </div>
    `
  }
)
export class BoxDragComponent implements OnInit {
  box: BoxType
  graph: GraphType
  uibox: UIBoxType
  uigraph: UIGraphType
  grabpos: { x: number, y: number }
  aname: string
  subscription: Subscription

  constructor
  ( @Inject ( BoxDragService ) boxService: BoxDragService
  ) {
    this.subscription = boxService.subscribe ( box => this.setBox ( box ) )
  }

  change () {
    console.log ( 'Change name' )
    this.aname = 'Hello'
  }

  ngOnInit () {
  }

  setBox ( box: BoxType ) {
    this.box = box
    this.graph = initGraph ( this.box )
    this.uigraph = uimap ( this.graph )
    const uibox = this.uigraph.uibox [ rootGraphId ]
    console.log ( "UIBOX", this.uibox === uibox, uibox.name )
    this.uibox = uibox
    this.grabpos = this.uibox.outpos
  }
}
