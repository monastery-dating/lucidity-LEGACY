/* global Node */
import React from 'react'
import {connect} from 'cerebral/react'
import expandInner from './lib/expandInner'
import getCommand from './lib/getCommand'
import getSelection from './lib/getSelection'
import isArrows from './lib/isArrows'

import './style.css'

import ToolBox from './ToolBox'

export default connect(
  {
    compositionInner: 'editor.composition.i.*'
  },
  {
    inputChange: 'editor.inputChanged',
    backspacePress: 'editor.backspacePressed',
    enterPress: 'editor.enterPressed'
  },
  function Editor ({compositionInner, backspacePress, enterPress, inputChange}) {
    const onInput = e => {
      const selection = getSelection()
      const {anchorNode} = window.getSelection()
      const value = anchorNode.textContent
      inputChange({value, selection})

      if (anchorNode.nodeType !== Node.TEXT_NODE) {
        // Not an edit
        return
      }
    }

    const onKeyDown = e => {
      switch (e.key) {
        case 'Enter':
          e.preventDefault()
          enterPress({selection: getSelection()})
          return
        case 'Backspace':
          e.preventDefault()
          backspacePress({selection: getSelection()})
          return
        default:
          // do nothing
      }

      const selection = getSelection()
      const command = getCommand(e)
      if (command) {
        // handle copy/paste/bold, etc
        // console.log(command)
      } else if (!selection.noSelection && !isArrows(e)) {
        backspacePress({selection})
        // then continue with edit ?
      }
    }

    const onSelect = e => {
      const selection = getSelection()
      if (selection.anchorOffset === 0) {
        if (selection.anchorValue === '') {
          // console.log('PARA.NEW', selection)
        } else {
          // console.log('PARA.START', selection)
        }
      }
    }

    return <div className='Editor'
        onInput={onInput}
        onSelect={onSelect}
        onKeyDown={onKeyDown}
        contentEditable
        suppressContentEditableWarning
        >
        {expandInner('editor.composition', compositionInner)}
        <ToolBox />
      </div>
  }
)
