import * as check from 'check-types'

export const makeDoc =
( { state
  , input: { path, value }
  , output
  }
) => {
  // prepare doc
  const base = path.slice ( 0, path.length - 1 )
  const key  = path [ path.length - 1 ]
  const doc = Object.assign
  ( {}
  , state.get ( base )
  // /data/main = type/foo = _id/value = key
  // / 0  / 1         / 2       / 3
  , { [ key ]: value, type: path [ 1 ], _id: path [ 2 ] }
  )
  output ( { doc } )
}

makeDoc [ 'input' ] =
{ path: check.array.of.string
, value: check.assigned
}
