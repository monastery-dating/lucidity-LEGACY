/* global Node */
import React from 'react'
import {connect} from 'cerebral/react'
import expandInner from './lib/expandInner'
import getPath from './lib/getPath'
import getSelection from './lib/getSelection'
import './style.css'

import ToolBox from './ToolBox'

export default connect(
  {
    composition: 'editor.composition.*'
  },
  {
    contentChange: 'editor.contentChanged',
    enterPress: 'editor.enterPressed'
  },
  function Editor ({composition, enterPress, contentChange}) {
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
          e.preventDefault()
          enterPress({selection: getSelection()})
          return
        default:
          // do nothing
      }
    }

    const onSelect = e => {
      const selection = getSelection()
      if (selection.anchorOffset === 0) {
        if (selection.anchorValue === '') {
          console.log('PARA.NEW', selection)
        } else {
          console.log('PARA.START', selection)
        }
      }
    }

    return <div className='Editor'
        onInput={onInput}
        onSelect={onSelect}
        onKeyPress={onKeyPress}
        contentEditable
        suppressContentEditableWarning
        >
        {expandInner('editor.composition', composition.i)}
        <ToolBox />
      </div>
  }
)
