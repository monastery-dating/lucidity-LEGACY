import React from 'react'
import {connect} from 'cerebral/react'
import getSelection from '../lib/getSelection'

export default connect(
  null,
  {
    applyOp: 'editor.applyOpTriggered'
  },
  function Select ({applyOp}) {
    const click = (e, op) => {
      const selection = getSelection()
      applyOp({op, selection})
      e.preventDefault()
    }
    const onMouseDown = e => e.preventDefault()
    return (
      <div className='ToolBox-menu'>
        <div className='ToolBox-item'
          onClick={e => click(e, 'B')}
          onMouseDown={onMouseDown}>
          <i className='strong'>B</i>
        </div>
        <div className='ToolBox-item'
          onClick={e => click(e, 'I')}>
          <i className='em'>I</i>
        </div>
        <div className='ToolBox-item'
          onClick={e => click(e, 'A')}>
          <i className='em'>link</i>
        </div>
      </div>
    )
  }
)
