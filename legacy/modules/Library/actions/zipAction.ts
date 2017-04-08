import { ActionContextType } from '../../context.type'
import * as check from 'check-types'
import { LibraryHelper } from '../../Library/helper/LibraryHelper'

export const zipAction =
( { state
  , output
  } : ActionContextType
) => {
  const library = state.get ( [ 'data', 'component' ] )

  LibraryHelper.zip
  ( library
  , ( source ) => {
      output.success
      ( { filename: 'library.zip', mime: 'application/zip', content: source }
      )
    }
  )
}

zipAction [ 'async' ] = true
