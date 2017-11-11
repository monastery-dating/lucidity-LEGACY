import { set, toggle } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { ParagraphOption } from 'editor'

import { CodeEditor, CodeIcon } from '../../components/Code'

export interface CodeSignal {
}

export interface CodeState {
  source: string
  lang: string
}

export const codeParagraph: ParagraphOption =
{ init:
  { code: ''
  , lang: 'ts'
  }
, tag: CodeEditor
, toolbox: CodeIcon
}

export const code = {
  signals:
  { 
  }
}
