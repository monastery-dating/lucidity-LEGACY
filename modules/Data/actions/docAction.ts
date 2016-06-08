import { ActionContextType } from '../../context.type'
import * as check from 'check-types'

export const docAction =
( { state
  , input: { key, type, value }
  , output
  } : ActionContextType
) => {

  // prepare doc
  const doc = Object.assign
  ( {}
  , state.get ( [ type ] )
  , { [ key ]: value }
  )

  const path = [ type, key ]

  // mark element as 'saving'
  state.set ( [ '$factory', ...path, 'saving' ], true )
  // temporary value during save
  state.set ( [ '$factory', ...path, 'value' ], value )

  output ( { doc } )
}

docAction [ 'input' ] =
{ type: check.string
, key: check.string
, value: check.string
}
