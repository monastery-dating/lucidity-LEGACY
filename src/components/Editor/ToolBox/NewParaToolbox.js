import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  {
    toolbox: 'editor.$toolbox'
  },
  function ParaToolbox ({toolbox}) {
    if (!toolbox) {
      return null
    }
    return (
      <div className='ToolBox-wrapper'
        contentEditable={false}
        >
        <div className='ToolBox'>
          <div className='ToolBox-menu'>
            <div className='ToolBox-item'>
              <i className='block'>Image</i>
            </div>
            <div className='ToolBox-item'>
              <i className='block'>Block</i>
            </div>
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
