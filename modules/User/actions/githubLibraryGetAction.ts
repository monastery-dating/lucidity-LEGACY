import { ActionContextType } from '../../context.type'
import * as check from 'check-types'
import { SceneByIdType } from '../../Scene'
import { LibraryHelper } from '../../Library/helper/LibraryHelper'
import { GraphType } from '../../Graph'



const download =
( filename, type, source ) => {
  const el = document.createElement ( 'a' )
  el.setAttribute
  ( 'href'
  , `data:${type};charset=utf-8;base64,` + source
  )
  el.setAttribute ( 'download', filename )
  el.style.display = 'none'
  document.body.appendChild ( el )
  el.click()
  document.body.removeChild ( el )
}

export const githubLibraryGetAction =
( { state
  , output
  } : ActionContextType
) => {
  const user = state.get ( [ 'user' ] )
  const libpath  = user.libraryGithubPath
  const token = user.libraryGithubToken
  if ( libpath && token ) {
    /*
    // const tree = `https://api.github.com/repos/${path}/git/trees`
    // const url = `https://api.github.com/repos/${path}`
    const get =
    ( path, clbk ) => {
      const url = `https://api.github.com/repos/${libpath}${path}`
      const xhr = new XMLHttpRequest ()
      xhr.open ( 'get', url, true )
      xhr.setRequestHeader ( 'Accept', 'application/vnd.github.v3+json' )
      xhr.onload = () => {
        clbk ( JSON.parse ( xhr.response ) )
      }
      xhr.send ()
    }

    get ( '/git/refs/heads/master', ( o ) => {
      const sha = o.object.sha
      get ( `/git/trees/${sha}`, ( o ) => {
        const tree = {}
        o.tree.forEach ( e => tree [ e.path ] = e )
        console.log ( tree )
      })
    })
    */
  }

  const library = state.get ( [ 'data', 'component' ] )
  LibraryHelper.zip
  ( library
  , ( source ) => {
      download ( 'library.zip', 'application/zip', source )
    }
  )

}

// githubLibraryGetAction [ 'async' ] = true
