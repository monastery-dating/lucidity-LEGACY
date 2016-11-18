import React from 'react'
import {connect} from 'cerebral/react'

import Composition from './Composition'
import ToolBox from './ToolBox'

export default connect(
  null,
  function Editor () {
    return <div className='Editor'>
        <Composition />
        <ToolBox />
      </div>
  }
)
