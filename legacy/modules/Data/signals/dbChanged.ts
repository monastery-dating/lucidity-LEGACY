import { update } from '../actions/update'
import { saved } from '../actions/saved'
import { edit } from '../actions/edit'
import { status } from '../../Status'

export const dbChanged =
[ update
, status
, saved
, edit // open name for editing (depends on a flag in $factory)
]
