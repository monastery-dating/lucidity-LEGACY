import { SignalType } from '../../context.type'
import { addAction } from '../actions/addAction'
import { selectAction } from '../actions/selectAction'
import { save } from '../../Data'
import * as copy from 'cerebral-addons/copy'

export const add: SignalType =
[ addAction
, copy ( 'input:/_id', 'state:/$sceneId' )
, ...save
]
