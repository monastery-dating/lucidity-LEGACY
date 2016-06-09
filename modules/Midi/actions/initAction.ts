import { ActionContextType } from '../../context.type'
import { MidiHelper } from '../helper/MidiHelper'

export const initAction =
( { state
  , output
  } : ActionContextType
) => {
  console.log ( 'init' )
  MidiHelper.init ()
  .then ( ( message ) => {
    output.success ( { status: 'ok', message } )
  })
  .catch ( ( message ) => {
    output.error ( { status: 'error', message } )
  })
}

initAction [ 'async' ] = true
