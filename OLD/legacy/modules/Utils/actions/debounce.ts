import { SignalAction } from '../../context.type'

export const debounce = ( ms: number ): SignalAction => {
  let done = false
  let last

  const doit = ( output ) => {
    if ( done ) {
      output.ignored ( {} )
    }
    else if ( Date.now () - last >= ms ) {
      output.accepted ( {} )
      done = true
    }
    else {
      output.ignored ( {} )
    }
  }
  const action = ( { output } ) => {
    done = false
    last = Date.now ()
    setTimeout ( () => doit ( output ), ms )
  }
  action [ 'async' ] = true
  action [ 'outputs' ] = [ 'accepted', 'ignored' ]
  return action
}
