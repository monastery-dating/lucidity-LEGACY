import { setStatus } from '../../Status/actions/set'
import reloadData from '../../Data/actions/reload'
import dataToState from '../../Data/actions/dataToState'
import runtests from './runtests'
import * as set from 'cerebral-addons/set'

const output = ( a ) => {
  return ( { output } ) => {
    output ( a )
  }
}

const loginput = ( { input } ) => {
  console.log ( 'LOGINPUT', input )
}

export default
[ setStatus ( { type:'info', message: 'Lucidity started' } )
, [ reloadData
  , { success: [ dataToState /*, connect */ ]
    , error: [ setStatus ]
    }
  ]
, ...runtests
]
