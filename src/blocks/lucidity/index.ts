export { App } from './components/App'

import { Block } from 'builder'
import { EditorBlock } from 'blocks/Editor'
import { WatchBlock } from 'blocks/watch'
import { signal } from 'cerebral/tags'

import { Code, CodeIcon } from './components/Code'
import { data, DataState } from './modules/data'
import { navigation, NavigationSignal, NavigationState } from './modules/navigation'
import { prefs, PrefsSignal, PrefsState } from './modules/prefs'
import { router, RouterSignal, RouterState } from './modules/router'

export interface AppState {
  data: DataState
  navigation: NavigationState
  prefs: PrefsState
  router: RouterState
}

export interface AppSignal {
  data: {}
  navigation: NavigationSignal
  prefs: PrefsSignal
  router: RouterSignal
}

export const app: Block < EditorBlock > =
{ name: 'sarigama'
, editor:
  { code:
    { init:
      { text: ''
      }
    , tag: Code
    , toolbox: CodeIcon
    }
  }
, modules:
  { app: { state: { name: 'Sarigama' } }
  , data
  , navigation
  , prefs
  , router
  }
}