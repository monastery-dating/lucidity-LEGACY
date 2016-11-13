import React from 'react'
import {connect} from 'cerebral/react'
import {Computed} from 'cerebral'

const Name = Computed(
  {
    name: 'foo.bar'
  },
  function Name ({name}) {
    return name
  }
)

export default connect(
  {
    name: Name
  },
  function Foo ({name}) {
    return <div>{name}</div>
  }
)
