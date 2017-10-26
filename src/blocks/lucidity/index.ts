export { App } from './components/App'

import { Block } from 'builder'
import { EditorBlock } from 'blocks/Editor'
import { WatchBlock } from 'blocks/watch'
import { signal } from 'cerebral/tags'

import { code, codeParagraph, CodeSignal, CodeState } from './modules/code'
import { data, DataState } from './modules/data'
import { navigation, NavigationSignal, NavigationState } from './modules/navigation'
import { prefs, PrefsSignal, PrefsState } from './modules/prefs'
import { router, RouterSignal, RouterState } from './modules/router'
import { latex, latexParagraph, LatexSignal, LatexState } from './modules/latex'

export * from './types'
export * from './lucidity.types'

export interface AppState {
  code: CodeState
  data: DataState
  latex: LatexState
  navigation: NavigationState
  prefs: PrefsState
  router: RouterState
}

export interface AppSignal {
  code: CodeSignal
  data: {}
  latex: LatexSignal
  navigation: NavigationSignal
  prefs: PrefsSignal
  router: RouterSignal
}

export const app: Block < EditorBlock > =
{ name: 'sarigama'
, editor:
  { code: codeParagraph
  , latex: latexParagraph
  }
, modules:
  { app: { state: { name: 'Sarigama' } }
  , code
  , data
  , latex
  , navigation
  , prefs
  , router
  }
}