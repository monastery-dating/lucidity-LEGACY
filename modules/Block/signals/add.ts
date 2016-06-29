import { SignalType } from '../../context.type'
import { addAction } from '../actions/addAction'
import { save } from '../../Data/signals/save'
import * as copy from 'cerebral-addons/copy'
import { status } from '../../Status'

export const add: SignalType =
[ addAction
, { success:
    [ copy ( 'input:/editname', 'state:/$factory.block.add' )
    , ...save
    ]
  , error:
    [ status ]
  }
]
