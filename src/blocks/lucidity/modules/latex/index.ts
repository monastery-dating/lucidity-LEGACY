import { set, toggle } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { ParagraphOption } from 'editor'

import { Latex, LatexIcon } from '../../components/Latex'

export interface LatexSignal {
  toggleEdit: ( arg: { path: string } ) => void
  changeLatex: ( arg: { path: string, source: string } ) => void
}

export interface LatexState {
  $edit?: boolean
  source: string
  lang: string // 'latex'
}

export const latexParagraph: ParagraphOption =
{ init:
  { source: 'c = \\pm\\sqrt{a^2 + b^2}'
  , lang: 'latex'
  }
, tag: Latex
, toolbox: LatexIcon
}

export const latex = {
  signals:
  { changeLatex:
    [ set ( state`${ props`path` }.source`, props`source` )
    ]
  , toggleEdit:
    [ toggle ( state`${ props`path` }.$edit` )
    ]
  }
}
