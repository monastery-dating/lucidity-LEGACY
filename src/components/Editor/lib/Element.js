import React from 'react'
import {connect} from 'cerebral/react'
import expandInner from './expandInner'
import getElementTag from './getElementTag'
import getElementClassName from './getElementClassName'
import setSelection from './setSelection'

export default connect(
  ({path}) => ({
    elem: `${path}.*`
  }),
  function Element ({path, elemRef, elem}) {
    if (!elem) {
      // Do not know why we need this. parseInner should remove.
      return null
    }
    const type = elem.t
    const inner = elem.i
    const Tag = getElementTag(type)
    const className = getElementClassName(type)

    return <Tag
      data-ref={elemRef}
      className={className}
      ref={n => setSelection(n, path)}
      >
        { typeof inner === 'string'
        ? inner
        : expandInner(path, inner)
        }
      </Tag>
  }
)
