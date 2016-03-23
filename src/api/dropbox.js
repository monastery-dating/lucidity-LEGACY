/* eslint "max-len":0 */

const DB_AUTH = 'Bearer y8SoATR0UM8AAAAAAACCg1GIlt0Ci2K0nKnuAJLmnVfM_rzKAgEdJYX164mJ61Ae'
const DB_HOST = 'https://api.dropboxapi.com'
const DB_URL  =
{ list: '/2/files/list_folder'
, download: '/2/files/download'
}
const DB_METHOD = 'post'

const HEADERS = new Headers ()
HEADERS.append ( 'Content-Type', 'application/json' )
HEADERS.append
( 'Authorization'
, DB_AUTH
)

const open = function ( path ) {
  return new Promise
  ( ( resolve, reject ) => {
      fetch
      ( DB_HOST + DB_URL.list
      , { method: DB_METHOD
        , headers: HEADERS
        , mode: 'cors'
        , body: JSON.stringify
          ( { path
            , recursive: true
            }
          )
        }
      ).then
      ( response => {
          if ( response.status !== 200 ) {
            response.json ().then
            ( json => {
                reject
                ( `Could not retrieve data: ${ json.error_summary }` )
              }
            )
            .catch ( err => reject ( err ) )

            return
          }
          response.json ().then
          ( json => {
              resolve ( json.entries )
            }
          )
          .catch ( err => reject ( err ) )
        }
      )
      .catch ( err => reject ( err ) )
    }
  )
}

const MOCK = true

const library = function ( appPath ) {
  return new Promise
  ( ( resolve, reject ) => {
      if ( MOCK ) {
        resolve
        ( [ { name: 'alpha.Hello' }
          , { name: 'alpha.Lucy' }
          , { name: 'beta.Mix' }
          , { name: 'beta.Lala' }
          ]
        )
      }
      else {
      open ( `${appPath}/library` ).then
      ( data => {
          const base = data.shift ()
          if ( base[ '.tag' ] !== 'folder' ||
               base.name   !== 'library' ) {
            reject
            ( `Could not get correct data. Object is ${library.name}.` )
          }
          else {
            resolve
            ( data.map
              ( element => ( { name: element.name } ) )
              .sort
              ( ( a, b ) => a.name > b.name ? 1 : -1 )
            )
          }
        }
      )
      .catch ( err => reject ( err ) )
      }
    }
  )
}


export default {
  open
, library
// , files
// , graph
}
