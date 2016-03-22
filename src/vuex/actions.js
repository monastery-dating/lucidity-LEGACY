import
{ RECEIVE_LIBRARY
, REFRESHING_LIBRARY
, REFRESHING_LIBRARY_ERROR
} from './mutation-types'
import Backend from '../api/dropbox.js'

// We are using Dropbox 'App' authorization.
// LucidityDev
const APP_PATH = ""

export const refreshLibrary =
function ( { dispatch } ) {
  dispatch ( REFRESHING_LIBRARY, true )

  Backend.library ( APP_PATH ).then
  ( data => {
      dispatch ( RECEIVE_LIBRARY, data )
    }
  )
  .catch ( error => {
      dispatch ( REFRESHING_LIBRARY_ERROR, error )
    }
  )
}
