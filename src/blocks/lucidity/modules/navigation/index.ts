import { set, toggle, unset, when } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'

export interface NavigationState {
  activity: string
  navigator?: boolean
  navigatorType: string
  trustKeys?: string
}

export interface NavigationSignal {
  home (): void
  tabClicked ( arg: { type: string } ): void
  selectActivity ( arg: { activity: string } ): void
  selectItem ( arg: { type: string, id: string } ): void
}

export const navigation = 
{ state:
  { activity: process.env.NODE_ENV === 'debug'
      // DEBUG
      ? 'Score'
      : 'Home'
  , navigatorType: 'Document'
  }
, signals:
  { home:
    [ set ( state`navigation.activity`, 'Home' )
    , unset ( state`navigation.trustKeys` )
    ]
  , selectActivity:
    [ when ( props`activity`, ( a: string ) => a === 'Navigator' )
    , { true:
        [ toggle ( state`navigation.navigator` )
        ]
      , false:
        [ set ( state`navigation.activity`, props`activity` )
        ]
      }
    , unset ( state`navigation.trustKeys` )
    ]
  , selectItem:
      /* TODO: make sure document is saved, load other document */ 
    [ set ( state`navigation.activity`, props`type` )
    , set ( state`document`, state`data.${ props`type` }.${ props`id` }` )
    ]
  , tabClicked:
    [ set ( state`navigation.navigatorType`, props`type` )
    ]
  }
}