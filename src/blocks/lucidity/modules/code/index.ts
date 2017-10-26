import { set, toggle } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'

import { CodeEditor, CodeIcon } from '../../components/Code'

export interface CodeSignal {
}

export interface CodeState {
  code: string
}

export const codeParagraph =
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
