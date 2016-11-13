import React from 'react'
import {Editor as Draft, EditorState} from 'draft-js'
import {stateToMarkdown} from 'draft-js-export-markdown'
import {connect} from 'cerebral/react'

import './style.css'

let state = EditorState.createEmpty()

export default connect(
  {
    editorState: 'editor.$draft.**'
  },
  {
    onChange: 'editor.draftChanged'
  },
  function Editor ({onChange}) {
    const change = c => {
      const content = c.getCurrentContent()
      console.log(stateToMarkdown(content))
      onChange({key: 'foo', value: Math.random()})
      state = c
    }
    return <div className='Editor'>
      <Draft editorState={state} onChange={change} />
    </div>
  }
)
