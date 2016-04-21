import { BoxComponent } from '../common/box.component'
import { Directive, ElementRef, Inject, Input, OnInit, Output, SimpleChange } from 'angular2/core'
import { BoxDragService } from './boxdrag.service'
import { defaultUILayout } from '../common/uilayout.type'

@Directive
( { selector: '[le-box-drop]'
  , providers:
    [
    ]
  }
)
export class BoxDrop implements OnInit {
  // @Input( 'interact' ) bag: string
  // @Input() interactModel: any
  private container: any

  constructor
  ( @Inject ( ElementRef ) private el: ElementRef
  , @Inject ( BoxDragService ) private boxer: BoxDragService
  ) {
    this.container = el.nativeElement
  }

  ngOnInit () {
    this.boxer.registerDropzone ( this.container, 'graph' ) // FIXME: how to get 'from' ?
  }

  // ngOnChange ( changes: { [ key: string ]: SimpleChange } ) {
  // }
}
