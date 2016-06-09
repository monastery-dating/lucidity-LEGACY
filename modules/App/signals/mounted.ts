import { setStatus } from '../../Status/actions/status'
import { reload } from '../../Data/signals/reload'
import { runtests } from '../../Test/signals/runtests'
import { init as initMidi } from '../../Midi/signals/init'
import * as set from 'cerebral-addons/set'

export const mounted =
[ setStatus ( { type:'info', message: 'Lucidity started' } )
, [ ...reload ]   // async
, [ ...initMidi ] // async
, ...runtests     // sync
]
