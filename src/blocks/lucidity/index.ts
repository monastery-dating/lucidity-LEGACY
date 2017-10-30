export { App } from './components/App'

import { Block } from 'builder'
import { DocumentBlock } from 'blocks/Document'
import { EditorBlock } from 'blocks/Editor'
import { WatchBlock } from 'blocks/watch'
import { signal } from 'cerebral/tags'

import { branch, branchParagraph, defaultBranch, BranchSignal, BranchState } from './modules/branch'

import { code, codeParagraph, CodeSignal, CodeState } from './modules/code'
import { data, DataState } from './modules/data'
import { navigation, NavigationSignal, NavigationState } from './modules/navigation'
import { prefs, PrefsSignal, PrefsState } from './modules/prefs'
import { router, RouterSignal, RouterState } from './modules/router'
import { latex, latexParagraph, LatexSignal, LatexState } from './modules/latex'

export * from './types'
export * from './lucidity.types'

export interface AppState {
  branch: BranchState
  code: CodeState
  data: DataState
  latex: LatexState
  navigation: NavigationState
  prefs: PrefsState
  router: RouterState
}

export interface AppSignal {
  branch: BranchSignal
  code: CodeSignal
  data: {}
  latex: LatexSignal
  navigation: NavigationSignal
  prefs: PrefsSignal
  router: RouterSignal
}

export const app: Block < EditorBlock & DocumentBlock > =
{ name: 'sarigama'
, document:
  { elements:
    { para4:
      { t: 'P', p: 4
      , c: 'branch'
      }
    }
  , data:
    { para4:
      JSON.parse ( JSON.stringify ( defaultBranch ) )
    }
  }
, editor:
  { branch: branchParagraph
  , code: codeParagraph
  , latex: latexParagraph
  }
, modules:
  { app: { state: { name: 'Sarigama' } }
  , branch
  , code
  , data
  , latex
  , navigation
  , prefs
  , router
  }
}