import { unset, when } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { changeText } from '../actions/changeText'
import { processOps } from '../actions/processOps'

export const handleInputSignal =
[ changeText
, when ( props`ops` )
    // This means that we had to strip chars. Need to reset toolbox:
, { true:
    [ unset ( state`editor.$toolbox` )
    , processOps
    ]
  , false: []
  }
]
