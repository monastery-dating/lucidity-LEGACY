// FIXME: move Component to '/lib' ?
// FIXME: move Factory to '/lib' ?
// FIXME: should import styles ?
import { Component } from '../../../app/Component'

// Add new element
export const add =
( type: string, path: string[] ) => {

  const comp = Component
  ( {}
  , ( { props, children, signals } ) => {
      const klass = props.class || {}
      klass.add = true

      const addElement = () => {
        signals.$factory.add
        ( { path, type } )
      }
      return <div
          class={ klass }
          on-click={ addElement }>
          { children }
        </div>
    }
  )

  return comp
}
