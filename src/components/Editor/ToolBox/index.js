import React from 'react'
import {connect} from 'cerebral/react'
import './style.css'

import ParaToolbox from './ParaToolbox'
import NewParaToolbox from './NewParaToolbox'

export default connect(
  {
    toolbox: 'editor.$toolbox'
  },
  function ToolBox ({toolbox}) {
    if (!toolbox) {
      return null
    }
    const {type} = toolbox
    switch (type) {
      case 'para':
        return <ParaToolbox />
      case 'para.empty':
        return <NewParaToolbox />
      default:
        throw new Error(`Unknown toolbox type '${type}'`)
    }
    return (
      <div className='ToolBox-wrapper'
        contentEditable={false}
        >
        <div className='ToolBox'>
          <div className='ToolBox-menu'>
            <div className='ToolBox-item'>
              <i className='heading'>H1</i>
            </div>
            <div className='ToolBox-item'>
              <i className='heading'>H2</i>
            </div>
            <div className='ToolBox-item'>
              <i className='heading'>H3</i>
            </div>
            <div className='ToolBox-item'>
              <i className='para'>P</i>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
