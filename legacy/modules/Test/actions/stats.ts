import { TestStats, failureMessage } from '../runner'
import { StatusType } from '../../Status'

export const stats =
( { state, input, output } ) => {
  const stats: TestStats = input.stats
  const m = [ `${stats.passCount}/${stats.testCount} tests pass` ]
  if ( stats.failCount ) {
    m.push ( `${stats.failCount} fail`)
  }

  if ( stats.pendingCount ) {
    m.push ( `${stats.pendingCount} pending`)
  }

  const s: StatusType =
  { type: 'success', message: m.join ( ',' ) }

  if ( stats.passCount !== stats.testCount ) {
    s.detail = stats.failures.map ( failureMessage )

    if ( stats.failCount ) {
      s.type = 'error'
    }
    else {
      s.type = 'warn'
    }
  }

  output.success ( { status: s } )
}
