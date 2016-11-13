import React from 'react'
import {connect} from 'cerebral/react'
import parseMarkup from './lib/parseMarkup'
import getElementTag from './lib/getElementTag'

export default connect(
  ({elementRef}) => ({element: `editor.composition.paragraphs.${elementRef}`}),
  function Element ({element}) {
    const type = element.type

    const Tag = getElementTag(element.type)

    switch (type) {
      case 'P':
        return <Tag data-ref={element.ref}>
            {parseMarkup(element)}
          </Tag>
      default:
        return null
    }
  }
)
