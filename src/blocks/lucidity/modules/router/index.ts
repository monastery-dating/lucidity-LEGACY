import { State } from 'app'
import { compute } from 'cerebral'
import { props, signal, state } from 'cerebral/tags'
import Router from '@cerebral/router'

export interface RouterState {
}

export interface RouterSignal {
}

interface CheckTypes {
  activity: typeof State.navigation.activity  
  trustKeys: typeof State.navigation.trustKeys
}

export const router =
Router
( { routes:
    [ { path: '/'
      , map:
        { activity: state`navigation.activity`
        , trustKeys: state`navigation.trustKeys`
        }
      }
    ]
    , query: true
    , onlyHash: true
  }
)