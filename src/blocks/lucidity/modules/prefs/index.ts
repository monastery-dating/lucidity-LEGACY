import { CerebralModule } from 'builder'
import { parallel } from 'cerebral'
import { debounce, set, unset } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import * as data from 'data'

function setDebounce ( root: string, key: string, ms: number = 200 ) {
  return parallel
  ( [ set ( state`${root}.$${key}`, props`${key}` ) 
    , [ debounce ( ms )
      , { continue:
          [ set ( state`${root}.${key}`, props`${key}` )
          , unset ( state`${root}.$${key}` )
          , data.setPref
            ( key
            , props`${ key }`
            )
          ]
        , discard: []
        }
      ]
    ]
  )
}


// This is synced to remote user.$uid.prefs
export interface PrefsState {
  // Set to true when database in syncing here
  $sync?: boolean
  $scoreScale?: number
  // Currently edited document
  editing?: string
  displayName: string
  lang: string
  scoreScale: number
  theme: string
}

export interface PrefsSignal {
  scaleInputChanged ( arg: { scoreScale: number } ): void
}

export const prefs: CerebralModule & { state: PrefsState } =
{ state:
  { displayName: ''
  , lang: 'fr'
  , scoreScale: 0.8
  , theme: 'basic'
  }
, signals:
  { scaleInputChanged: 
    [ setDebounce ( 'prefs', 'scoreScale' )
    ]
  }
}