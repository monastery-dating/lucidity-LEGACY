import { update } from '../actions/update'
import { saved } from '../actions/saved'
import { status } from '../../Status'

export const dbChanged =
[ update
, status
, saved
]
