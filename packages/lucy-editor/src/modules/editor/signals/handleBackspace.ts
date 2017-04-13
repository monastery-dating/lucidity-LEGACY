import { deleteSelectionSignal } from './deleteSelection'
import { processOps } from '../actions/processOps'

export const handleBackspaceSignal = 
[ ...deleteSelectionSignal
, processOps
]
