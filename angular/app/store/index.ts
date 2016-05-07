import { provide, OpaqueToken, Inject } from 'angular2/core'
import Baobab from 'baobab'

const makeState = function () {
  return new Baobab
  ( { colors: [ 'yellow', 'purple' ]
    , name: { name: 'Glorious colors' }
    }
  )
}

export const storeToken = new OpaqueToken ( 'state' )

export const store =
[ provide
  ( storeToken
  , { useFactory: makeState
    }
  )
]
