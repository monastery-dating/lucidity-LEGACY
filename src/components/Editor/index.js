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
    return <div className='Editor'>
      {paragraphRefList.map(ref => <Element key={ref} elementRef={ref} />)}
    </div>
  }
)
