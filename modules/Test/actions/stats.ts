import { TestStats } from '../runner'

export default ( { state, input } ) => {
  const m = [ `${input.passCount}/${input.testCount} inputs pass` ]
  if ( input.failCount ) {
    m.push ( `${input.failCount} fail`)
  }

  if ( input.pendingCount ) {
    m.push ( `${input.pendingCount} pending`)
  }

  state.set ( 'status.message', m.join ( ', ' ) )

  if ( input.passCount === input.testCount ) {
    state.set ( 'status.type', 'success' )
  }
  else if ( input.failCount ) {
    state.set ( 'status.type', 'error' )
  }
  else {
    state.set ( 'status.type', 'warn' )
  }
}
