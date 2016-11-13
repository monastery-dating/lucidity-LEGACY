import React from 'react'
import {connect} from 'cerebral/react'
import expandInner from './expandInner'
import getElementTag from './getElementTag'
import getElementClassName from './getElementClassName'

export default connect(
  ({path}) => ({elem: `${path}.*`}),
  function Element ({path, elemRef, elem}) {
    const type = elem.t
    const inner = elem.i
    const Tag = getElementTag(type)
    const className = getElementClassName(type)

    return <Tag
      data-ref={elemRef}
      className={className}
      >
        { typeof inner === 'string'
        ? inner
        : expandInner(path, inner)
        }
      </Tag>
  }
)
