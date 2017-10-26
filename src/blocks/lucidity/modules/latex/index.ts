import { set, toggle } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'

import { Latex, LatexIcon } from '../../components/Latex'

export interface LatexSignal {
  toggleEdit: ( arg: { path: string } ) => void
  changeLatex: ( arg: { path: string, code: string } ) => void
}

export interface LatexState {
  $edit?: boolean
  code: string
}

export const latexParagraph =
{ init:
  { code: 'c = \\pm\\sqrt{a^2 + b^2}'
  , lang: 'latex'
  }
, tag: Latex
, toolbox: LatexIcon
}

export const latex = {
  signals:
  { changeLatex:
    [ set ( state`${ props`path` }.code`, props`code` )
    ]
  , toggleEdit:
    [ toggle ( state`${ props`path` }.$edit` )
    ]
  }
}
