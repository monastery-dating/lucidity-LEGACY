import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  {
    toolbox: 'editor.$toolbox'
  },
  function Select ({toolbox}) {
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
              <i className='strong'>B</i>
            </div>
            <div className='ToolBox-item'>
              <i className='em'>I</i>
            </div>
          </div>
        </div>
      </div>
    )
  }
)
