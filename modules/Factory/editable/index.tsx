export * from './changed.signal'
export * from './saved.action'

// FIXME: move Component to '/lib' ?
// FIXME: move Factory to '/lib' ?
import { Component } from '../../../desktop/Component'
import { EditableText } from '../../../desktop/EditableText'

const EditingPath = [ '$factory', 'editing' ]

// Editable Component factory
export const editable =
( path ) => {
  const spath = path.join ( '-' )
  const fpath = [ '$factory', ...path ]
  return Component
  ( { text: path
    // where we store temporary value until saved
    , stext: [ ...fpath, 'value' ]
    // where we mark if the element is 'saving'
    , saving: [ ...fpath, 'saving' ]
    // where we store the currently editing field
    // (only one per app)
    , editing: EditingPath
    }
  , ( { state, signals } ) => {
      const edit = () => signals.$factory.set
      ( { path: EditingPath, value: spath } )

      const changed = ( value ) => signals.$factory.changed
      ( { path, value } )

      const isediting = state.editing === spath
      
      return <EditableText class='title'
          text={ state.text }
          stext={ state.stext } // shown while saving
          editing={ state.editing }
          saving={ state.saving }
          on-edit={ edit }
          on-change={ changed }
          />
    }
  )
}
