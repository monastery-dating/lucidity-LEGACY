import { SignalType } from '../../context.type'
import * as copy from 'cerebral-addons/copy'

export const select: SignalType =
[ copy ( 'input:/_id', 'state:/$sceneId' )
]
