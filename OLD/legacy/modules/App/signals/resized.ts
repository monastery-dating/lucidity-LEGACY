import { debounce } from '../../Utils'
import * as copy from 'cerebral-addons/copy'

export const resized =
[ debounce ( 16 )
, { accepted:
    [ copy ( 'input:/size', 'state:/$playback.size' )
    ]
  , ignored: []
  }
]
