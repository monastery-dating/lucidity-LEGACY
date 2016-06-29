import { ActionContextType } from '../../context.type'
import { loadLibrary, selectLibraryPath } from '../../FileStorage/helper/FileStorageHelper'
import * as check from 'check-types'

export const loadAction =
( { state
  , output
  } : ActionContextType
) => {
  selectLibraryPath ()
  .then ( path => {
    loadLibrary ( state, path )
  })
}

// selectAction [ 'async' ] = true
