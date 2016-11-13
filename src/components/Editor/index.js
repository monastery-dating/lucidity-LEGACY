/* global Node */
import React from 'react'
import {connect} from 'cerebral/react'
import paragraphRefList from '../../computed/paragraphRefList'

import Element from './Element'

import './style.css'

export default connect(
  {
    paragraphRefList
  },
  function Editor ({paragraphRefList}) {
    const onInput = e => {
      const selection = window.getSelection()
      const {anchorNode} = selection

      if (anchorNode.nodeType !== Node.TEXT_NODE) {
        // Not an edit
        return
      }

      console.log(anchorNode.parentElement.getAttribute('data-ref'))
      // Now we should compare with previous strings and send an
      // update for this element...
    }

    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter':
          return e.preventDefault()
        default:
          // do nothing
      }
    }

    return <div className='Editor'
        onInput={onInput}
        onKeyPress={onKeyPress}
        contentEditable
        suppressContentEditableWarning>
        {paragraphRefList.map(ref => <Element key={ref} elementRef={ref} />)}
      </div>
  }
)
