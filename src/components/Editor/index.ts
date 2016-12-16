import React from 'react'
import {connect} from 'cerebral/react'

import Composition from './Composition'
import ToolBox from './ToolBox'

export default connect(
  null,
  function Editor ({editorRef}) {
    // This editorRef should be unique by <Editor /> tag.
    let ref = `splendid33${editorRef || ''}`
    return <div className='Editor'>
        <div className='Editor-wrapper' id={ref}>
          <Composition />
          <ToolBox editorId={ref}/>
        </div>
      </div>
  }
)
