import React from 'react'
import {connect} from 'cerebral/react'
import getSelection from '../lib/getSelection'

export default connect(
  null,
  {
    applyOp: 'editor.applyOpTriggered'
  },
  function Select ({applyOp}) {
    const click = (t) => {
      const selection = getSelection()
      applyOp({op: t, selection})
    }
    return (
      <div className='ToolBox-menu'>
        <div className='ToolBox-item'
          onClick={() => click('B')}>
          <i className='strong'>B</i>
        </div>
        <div className='ToolBox-item'
          onClick={() => click('I')}>
          <i className='em'>I</i>
        </div>
        <div className='ToolBox-item'
          onClick={() => click('A')}>
          <i className='em'>link</i>
        </div>
      </div>
    )
  }
)
