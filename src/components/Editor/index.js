/* global Node */
import React from 'react'
import {connect} from 'cerebral/react'
import expandInner from './lib/expandInner'
import getPath from './lib/getPath'

import './style.css'

export default connect(
  {
    composition: 'editor.composition.*'
  },
  {
    contentChange: 'editor.contentChanged'
  },
  function Editor ({composition, contentChange}) {
    const onInput = e => {
      const selection = window.getSelection()
      const {anchorNode} = selection
      const path = getPath(anchorNode)
      const value = anchorNode.textContent
      console.log(selection)
      console.log(path, value)
      contentChange({path: `${path}.i`, value})

      if (anchorNode.nodeType !== Node.TEXT_NODE) {
        // Not an edit
        return
      }

      console.log(anchorNode.parentElement.getAttribute('data-ref'))
      // Now we should compare with previous strings and send an
      // update for this element...
    }

    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter':
          return e.preventDefault()
        default:
          // do nothing
      }
    }

    return <div className='Editor'
        onInput={onInput}
        onKeyPress={onKeyPress}
        contentEditable
        suppressContentEditableWarning
        >
        {expandInner('editor.composition', composition.i)}
      </div>
  }
)
