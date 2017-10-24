import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

const download =
( filename, type, source ) => {
}

export const downloadAction =
( { input: { filename, mime, content }
  } : ActionContextType
) => {
  const el = document.createElement ( 'a' )
  el.setAttribute
  ( 'href'
  , `data:${mime};charset=utf-8;base64,` + content
  )
  el.setAttribute ( 'download', filename )
  el.style.display = 'none'
  document.body.appendChild ( el )
  el.click()
  document.body.removeChild ( el )
}

downloadAction [ 'async' ] = true

downloadAction [ 'input' ] =
{ filename: check.string
, mime: check.string
, content: check.string // base64 encoded
}
