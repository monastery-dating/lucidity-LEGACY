import * as interact from 'interact-js'
import { Injectable, EventEmitter } from 'angular2/core'
import { Interaction } from './interaction.type.ts'

interface IBagHandler {
  ( interaction: Interaction )
}

interface IBagHandlers {
  move?: IBagHandler
  start?: IBagHandler
  drag?: IBagHandler
  end?: IBagHandler
  cancel?: IBagHandler
}

class InteractBag {
  private elements = []

  constructor ( private handlers: IBagHandlers ) {}

  watch ( element : any ) {
    for ( const e of this.elements ) {
      if ( e === element ) {
        return
      }
      this.applySettings ( element )
      this.elements.push ( element )
    }
  }

  applySettings ( element : any ) {

  }
}

interface IBagsType {
  [ key: string ]: InteractBag
}

@Injectable()
export class InteractService {
  private bags: IBagsType

  findOrCreate ( bagName : string ) : InteractBag {
    let b : InteractBag = this.bags [ bagName ]
    if ( !b ) {
      b = this.bags [ bagName ] = new InteractBag ()
    }
    return b
  }
}
