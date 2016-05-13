import { setStatus } from '../../Status/actions/status'
import { reload } from '../../Data'
import { runtests } from '../../Test/signals/runtests'
import * as set from 'cerebral-addons/set'

const output = ( a ) => {
  return ( { output } ) => {
    output ( a )
  }
}

export const mounted =
[ setStatus ( { type:'info', message: 'Lucidity started' } )
, [ ...reload ] // async
, ...runtests   // sync
]
