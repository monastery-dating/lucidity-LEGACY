import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'

const makeControl = ( ctrl, idx, matrix, clbk ) => {
  if ( ctrl.type === 'Slider' ) {
    const change = ( e: Event ) => {
      const el = e.target as HTMLInputElement
      const v = parseFloat ( el.value )
      clbk ( idx, [ v ] )
    }
    const v = ( matrix [ idx ] || ctrl.values ) [ 0 ]
    return <div class={{Slider:true, ctrl:true}}>
        <label>{ ctrl.labels [ 0 ] }</label>
        <input on-input={ change } type='range' min='0.0' max='1.0' step='0.001' value={ v }/>
      </div>
  }
  else if ( ctrl.type === 'Pad' ) {
    return <div class='Pad'>TODO</div>
  }
  else {
    return <div class='ctrl'>Unknown control '{ctrl.type}'</div>
  }
}
const makeControls = ( controls, matrix, clbk ) => {
  if ( !controls ) {
    return ''
  }

  if ( !matrix ) {
    matrix = []
  }

  return controls.map
  ( ( c, idx ) => makeControl ( c, idx, matrix, clbk ) )
}

export const Controls = Component
( { controls: [ '$controls' ]
  , matrix: [ '$playback', 'ctrl' ]
  }
, ( { state, props, signals }: ContextType ) => {
    const clbk = ( pos: number, values: number[] ) => {
      signals.block.values ( { values, pos } )
    }

    const matrix = state.matrix

    return <div class='Controls' style={ props.style }>
        { makeControls ( state.controls, matrix, clbk ) }
      </div>
  }
)
