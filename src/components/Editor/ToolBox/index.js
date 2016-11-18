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

export default connect(
  {
    toolbox: 'editor.$toolbox'
  },
  function ToolBox ({toolbox}) {
    if (!toolbox) {
      return null
    }
    const {type} = toolbox
    const Tool = TOOLS[type]
    if (!Tool) {
      throw new Error(`Unknown toolbox type '${type}'`)
    }
    console.log(Tool)
    return <Tool />
  }
)
