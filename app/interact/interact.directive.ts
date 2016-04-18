import * as interact from 'interact-js'
import { Directive, ElementRef, Input, OnInit, Output, SimpleChange } from 'angular2/core'
import { InteractService } from './interact.service'

@Directive
( { selector: '[interact]'
  }
)
export class Interact implements OnInit {
  @Input( 'interact' ) bag: string
  // @Input() interactModel: any
  private container: any

  constructor
  ( private el: ElementRef
  , private interactService: InteractService ) {
    this.container = el.nativeElement
  }

  ngOnInit () {
    const bag = this.interactService.findOrCreate ( this.bag )
    bag.watch ( this.container )
  }

  // ngOnChange ( changes: { [ key: string ]: SimpleChange } ) {
  // }
}
