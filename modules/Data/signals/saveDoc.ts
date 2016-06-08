import { SignalType } from '../../context.type'
import { docAction } from '../actions/docAction'
import { save } from './save'

export const saveDoc : SignalType =
[ docAction
, ...save
]
