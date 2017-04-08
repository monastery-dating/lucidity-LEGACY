import { setStatus } from '../../Status/actions/status'
import { bindkeys } from '../actions/bindkeys'
import { reload } from '../../Data/signals/reload'
import { runtests } from '../../Test/signals/runtests'
import { init as initMidi } from '../../Midi/signals/init'
import { debounce } from '../../Utils'
import * as set from 'cerebral-addons/set'

export const mounted =
[ setStatus ( { type:'info', message: 'Lucidity started' } )
, bindkeys
, [ ...reload ]   // async
, [ ...initMidi ] // async
// , ...runtests     // sync
]
