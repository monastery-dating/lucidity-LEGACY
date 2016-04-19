import { interact } from 'interact.js/interact.js'
import { BoxComponent } from '../common/box.component'
import { Directive, DynamicComponentLoader, ElementRef, Inject, Input, OnInit, Output, SimpleChange } from 'angular2/core'
import { BoxDragService } from './boxdrag.service'
import { defaultUILayout } from '../common/uilayout.type'

@Directive
( { selector: '[le-box-drag]'
  , providers:
    [
    ]
  }
)
export class LeBoxDrag implements OnInit {
  // @Input( 'interact' ) bag: string
  // @Input() interactModel: any
  private container: any
  private ghost: any

  constructor
  ( @Inject ( ElementRef ) private el: ElementRef
  , @Inject ( DynamicComponentLoader ) private dynLoader: DynamicComponentLoader
  , @Inject ( BoxDragService ) private boxcomp: BoxDragService
  ) {
    console.log ( this.boxcomp )
    this.container = el.nativeElement
    el.nativeElement.style['background-color'] = 'red'
  }

  ngOnInit () {
    console.log ( this.container )
    this.ghost = document.getElementById ( 'boxdrag' )
    this.ghost.style.display = 'none'
    // Register mouse events
    interact ( this.container )
    .styleCursor ( false )
    .draggable
    ( { onstart: ( event ) => {
        // Create shadow box for dragging
        console.log ( event.target.innerHTML )
        this.boxcomp.setBox ( event.target.innerHTML, [], 'any', 'Block' )
        this.ghost.style.opacity = '0.6'
        this.ghost.style.position = 'fixed'
        // FIXME: How could we get 'outpos' ?
        this.ghost.style.top  = event.clientY // - defaultUILayout.HEIGHT / 2 + defaultUILayout.SLOT
        this.ghost.style.left = event.clientX // - defaultUILayout.RADIUS + defaultUILayout.SPAD + defaultUILayout.SLOT
        this.ghost.style.display = 'block'
      }
      , onmove: ( event ) => {
          this.ghost.style.top  = event.clientY // - defaultUILayout.HEIGHT / 2 + defaultUILayout.SLOT
          this.ghost.style.left = event.clientX // - defaultUILayout.RADIUS + defaultUILayout.SPAD + defaultUILayout.SLOT
        }
      , onend: ( event ) => {
          console.log ( 'dragend' )
          this.ghost.style.display = 'none'
        }
      }
    )
  }

  // ngOnChange ( changes: { [ key: string ]: SimpleChange } ) {
  // }
}
