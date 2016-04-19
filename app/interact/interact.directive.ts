import { interact } from 'interact.js/interact'
import { Directive, ElementRef, Inject, Input, OnInit, Output, SimpleChange } from 'angular2/core'
// import { InteractService } from './interact.service'

@Directive
( { selector: '[interact]'
  }
)
export class Interact { // implements OnInit {
  // @Input( 'interact' ) bag: string
  // @Input() interactModel: any
  private container: any

  constructor
  ( @Inject ( ElementRef ) el: ElementRef ) {
  //, private interactService: InteractService ) {
    this.container = el.nativeElement
    el.nativeElement.style['border-color'] = 'red'
  }

  ngOnInit () {
  //  const bag = this.interactService.find ( this.bag )
  //  bag.watch ( this.container )
  console.log ( this.container )
    interact ( this.container )
    .draggable ( true )
    /*
    ( { dragmove: ( e ) => {
          console.log ( e.clientX0 )
        }
      }
    )
    */
  }

  // ngOnChange ( changes: { [ key: string ]: SimpleChange } ) {
  // }
}
