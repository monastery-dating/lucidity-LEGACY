import { Component } from '../../../desktop/Component'
import { ContextType, SignalsType } from '../../context.type'
import { EditableText } from './EditableText'

const EditingPath = [ '$factory', 'editing' ]

// We use a switch case instead of signals[ key ] to force type check.
const getSignal =
( signals: SignalsType, type, attr ) => {
  switch ( type ) {
    case 'block':
      switch ( attr ) {
        case 'name':
          return signals.block.name
      }
    break
    case 'project':
      switch ( attr ) {
        case 'name':
          return signals.project.name
      }
    case 'scene':
      switch ( attr ) {
        case 'name':
          return signals.scene.name
      }
    break
  }
}

// Editable Component factory
export const editable =
( path, idscope: string = '' ) => {
  const spath = path.join ( '-' ) + idscope
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
  , ( { state, signals, props }: ContextType ) => {
      const edit = () => signals.$factory.set
      ( { path: EditingPath, value: spath } )

      const signal = getSignal ( signals, path [ 0 ], path [ 1 ] )

      const changed = ( value ) => signal ( { value } )

      const isediting = state.editing === spath

      return <EditableText class={ props.class }
          text={ state.text }
          stext={ state.stext } // shown while saving
          editing={ isediting }
          saving={ state.saving }
          on-edit={ edit }
          on-change={ changed }
          />
    }
  )
}
