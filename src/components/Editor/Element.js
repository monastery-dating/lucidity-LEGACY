import React from 'react'
import {connect} from 'cerebral/react'

export default connect(
  ({elementRef}) => ({element: `editor.composition.paragraphs.${elementRef}`}),
  function Element ({element}) {
    const type = element.type

    const onInput = e => {
      console.log(e.type, e.target)
    }

    const onKeyPress = e => {
      console.log(e.key)
      switch (e.key) {
        case 'Enter':
          return e.preventDefault()
        default:
          // do nothing
      }
    }

    switch (type) {
      case 'p':
        return <p data-ref={element.ref} onKeyPress={onKeyPress} onInput={onInput} contentEditable dangerouslySetInnerHTML={{__html: element.text}} />
      default:
        return null
    }
  }
)
