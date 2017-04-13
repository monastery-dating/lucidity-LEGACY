import { when } from 'cerebral/operators'
import { props } from 'cerebral/tags'
import { handleSelect } from '../actions/handleSelect'
import { processOps } from '../actions/processOps'

export const handleSelectSignal =
[ handleSelect
, when ( props`ops` )
, { true: [ processOps ]
  , false: []
  }
]
