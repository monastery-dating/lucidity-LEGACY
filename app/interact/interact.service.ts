import * as interact from 'interact.js/interact.js'
import { Injectable, EventEmitter } from 'angular2/core'
import { InteractOpts } from './interaction.type'
export { Interact } from './interact.directive'
import { merge } from '../util/merge.util'

// Look at
// https://github.com/valor-software/ng2-dragula/blob/master/src/app/providers/dragula.provider.ts
class InteractBag {
  constructor ( private name: string, private options: InteractOpts ) {}

  watch ( element : any ) {
    this.applySettings ( element )
  }

  applySettings ( element : any ) {
    const e = interact ( element )
    console.log ( 'applySettings', this.name )
    for ( const key in this.options ) {
      console.log ( 'applySettings =', key )
      e [ key ] ( this.options [ key ] )
    }
  }

  merge ( options: InteractOpts ) {
    this.options = merge ( this.options, options )
  }
}

interface IBagsType {
  [ key: string ]: InteractBag
}

@Injectable()
export class InteractService {
  private bags: IBagsType

  find ( bagName ) : InteractBag {
    let b : InteractBag = this.bags [ bagName ]
    if ( !b ) {
      b = this.bags [ bagName ] = new InteractBag ( bagName, {} )
    }
    return b
  }

  setOptions ( bagName : string, options: InteractOpts ) {
    const b = this.find ( bagName )
    b.merge ( options )
  }
}
