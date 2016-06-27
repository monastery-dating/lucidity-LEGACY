import { Component } from '../../../app/Component'
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
    case 'user':
      switch ( attr ) {
        case 'name':
          return signals.user.name
        case 'libraryGithubPath':
          return signals.user.libraryGithubPath
        case 'libraryGithubToken':
          return signals.user.libraryGithubToken
      }
    break
  }
}

// Editable Component factory
export const editable =
( path, idscope: string = '' ) => {
  const spath = path.join ( '-' ) + idscope
  const fpath = [ '$factory', ...path ]

  const comp = Component
  ( { text: path
    // where we store temporary value until saved
    , stext: [ ...fpath, 'value' ]
    // where we mark if the element is 'saving'
    , saving: [ ...fpath, 'saving' ]
    // where we store the currently editing field
    // (only one per app)
    , editing: fpath // EditingPath
    }
  , ( { state, signals, props }: ContextType ) => {
      const edit = () => signals.$factory.set
      ( { path: fpath, value: state.text } )

      const changed = ( value ) => signals.$factory.set
      ( { path: fpath, value } )

      const signal = getSignal ( signals, path [ 0 ], path [ 1 ] )

      const save = ( value ) => signal ( { value } )

      const isediting = state.editing

      return <EditableText class={ props.class }
          text={ state.text }
          stext={ state.stext } // shown while saving
          editing={ isediting }
          saving={ state.saving }
          on-edit={ edit }
          on-save={ save }
          on-change={ changed }
          />
    }
  )

  comp.path = fpath

  return comp
}
