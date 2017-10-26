/*
import { SignalType } from '../../context.type'
import { nameAction } from '../actions/nameAction'
import { save } from '../../Data/signals/save'
import { selectAction } from '../actions/selectAction'
// import { source } from '../signals/source'

export const select: SignalType =
[ selectAction
  // FIXME: I cannot use custom output names...
  // Bug in Cerebral ?
, { error:
    [ nameAction
    , ...save
    , selectAction
    ]
  , success: []
  }
]
*/