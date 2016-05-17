import { setAction } from './set.action'
import { makeDoc } from './makeDoc.action'
import { save as saveData } from '../../Data'

export const set =
[ setAction
, { save: [ makeDoc, ...saveData ] }
]
