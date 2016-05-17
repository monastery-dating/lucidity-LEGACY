import { update } from '../actions/update'
import { saved } from '../../Factory'
import { status } from '../../Status'

export const dbChanged =
[ update
, status
, saved
]
