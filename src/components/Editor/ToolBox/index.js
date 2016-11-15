import React from 'react'
import {connect} from 'cerebral/react'

import './style.css'

export default connect(
  null,
  function ToolBox () {
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
