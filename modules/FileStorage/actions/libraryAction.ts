import { ActionContextType } from '../../context.type'

export const libraryAction =
( { state
  , input: { path, op, source }
  , output
  } : ActionContextType
) => {
  console.log ( 'library-changed', path, op, source )
}

libraryAction [ 'async' ] = true
