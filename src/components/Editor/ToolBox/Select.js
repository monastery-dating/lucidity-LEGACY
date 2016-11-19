import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  null,
  function Select () {
    return (
      <div className='ToolBox-menu'>
        <div className='ToolBox-item'>
          <i className='strong'>B</i>
        </div>
        <div className='ToolBox-item'>
          <i className='em'>I</i>
        </div>
        <div className='ToolBox-item'>
          <i className='em'>link</i>
        </div>
      </div>
    )
  }
)
