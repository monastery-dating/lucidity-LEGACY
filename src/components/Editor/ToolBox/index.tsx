import React from 'react'
import {connect} from 'cerebral/react'
import './style.css'

import Paragraph from './Paragraph'
import ParagraphEmpty from './ParagraphEmpty'
import Select from './Select'

const TOOLS = {
  Paragraph,
  ParagraphEmpty,
  Select
}

const LINE_HEIGHT = 16
const TOOL_PADDING = {
  top: LINE_HEIGHT + 12,
  left: {
    Select: -32,
    default: -16
  }
}

export default connect(
  {
    toolbox: 'editor.$toolbox'
  },
  function ToolBox ({editorId, toolbox}) {
    if (!toolbox) {
      return null
    }
    const {type, position} = toolbox
    const Tool = TOOLS[type]
    if (!Tool) {
      throw new Error(`Unknown toolbox type '${type}'`)
    }

    const editor = document.getElementById(editorId)
    const editorRect = editor
      ? editor.getClientRects()[0]
      : {top: 0, left: 0}

    const style = {
      top: position.top - editorRect.top + TOOL_PADDING.top,
      left: position.left - editorRect.left + (TOOL_PADDING.left[type] || TOOL_PADDING.left.default)
    }
    return (
      <div className={`ToolBox ${type}`}
        style={style}
        contentEditable={false}>
        <Tool />
      </div>
    )
  }
)
