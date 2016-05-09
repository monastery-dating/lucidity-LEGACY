import '../tests'
import { run } from '../runner'

export default ( { state } ) => {
  const test = run ()
  if ( test.allok ) {
    state.set ( 'status.type', 'ok' )
    state.set ( 'status.message', `${test.testcount} tests pass` )
  }
  else {
    state.set ( 'status.type', 'error' )
    state.set ( 'status.message', `${test.failcount}/${test.testcount} failed` )
  }
}
