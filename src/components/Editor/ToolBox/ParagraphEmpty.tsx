import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  null,
  function ParaToolbox () {
    return (
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
    )
  }
)
