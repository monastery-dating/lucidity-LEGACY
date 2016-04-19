import { BoxComponent } from '../common/box.component'
import { Directive, ElementRef, Inject, Input, OnInit, Output, SimpleChange } from 'angular2/core'
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
  private boxid: string

  constructor
  ( @Inject ( ElementRef ) private el: ElementRef
  , @Inject ( BoxDragService ) private boxer: BoxDragService
  ) {
    this.container = el.nativeElement
  }

  ngOnInit () {
    this.boxid = this.container.getAttribute ( 'data-le')
    this.boxer.register ( this.container, this.boxid, 'library' ) // FIXME: how to get 'from' ?
  }

  // ngOnChange ( changes: { [ key: string ]: SimpleChange } ) {
  // }
}
