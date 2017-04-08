import { SignalType } from '../../context.type'
import { moveAction } from '../actions/moveAction'
import * as throttle from 'cerebral-addons/throttle'

export const move: SignalType =
[ moveAction // no need to throttle ( 10, [ moveAction ] )
]
