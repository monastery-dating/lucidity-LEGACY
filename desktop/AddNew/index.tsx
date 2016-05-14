import './style.scss'
import { Component } from '../Component'

export const AddNew = Component
( {}
, ( { props, signals } ) => {
    const { path, type, text } = props
    const klass = props.class || {}
    klass.add = true

    const add = () => {
      const klass = props
      signals.$factory.add
      ( { path, type } )
    }
    return <div
        class={ klass }
        on-click={ add }>
        { text || '+' }
      </div>
  }
)
