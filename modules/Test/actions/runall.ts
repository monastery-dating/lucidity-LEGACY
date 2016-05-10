import '../tests'
import { run } from '../runner'

export default ( { state } ) => {
  const test = run ()
  const m = [ `${test.passCount}/${test.testCount} tests pass` ]
  if ( test.failCount ) {
    m.push ( `${test.failCount} fail`)
  }

  if ( test.pendingCount ) {
    m.push ( `${test.pendingCount} pending`)
  }

  state.set ( 'status.message', m.join ( ', ' ) )

  if ( test.allok ) {
    state.set ( 'status.type', 'success' )
  }
  else if ( test.failCount ) {
    state.set ( 'status.type', 'error' )
  }
  else {
    state.set ( 'status.type', 'warn' )
  }
}
