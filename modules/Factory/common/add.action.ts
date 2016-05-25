import { ActionContextType } from '../../context.type'
import { FactoryCreateHelperType } from '../types'
import { makeId } from '../makeId'

export const addAction =
( { state
  , input: { path, type }
  , services
  , output
  } : ActionContextType
) => {
  // path = [ 'project', 'scenes' ]
  // type = 'scene'
  const root = path [ 0 ]

  const docs = []

  const _id = makeId ()

  // create new element
  const helper = services [ type ]
  if ( helper && helper.create ) {
    const create: FactoryCreateHelperType = helper.create

    // creates documents for initial object of type 'type'
    create ( { _id, type } )
    .forEach ( ( d ) => {
      console.log ( d )
      docs.push ( d ) })
  }
  else {
    docs.push
    ( { _id
      , type
      , name: `New ${type}`
      }
    )
  }

  // Select this new element
  docs.push
  ( Object.assign
    ( {}
      // this is to get '_rev' if it exists
      , state.get ( [ 'data', 'main', type ] ) || {}
      , { type: 'main', _id: type, value: _id }
    )
  )

  // This is a flag that will set editing after db object
  // is selected.
  state.set ( [ '$factory', 'editing' ], type )

  if ( path.length > 1 ) {
    // add to parent
    // project.scenes
    const parent = state.get ( path [ 0 ] )
    const key = path [ path.length - 1 ]
    const skey = `${type}Id`
    const list = [ ... ( parent [ key ] || [] ), _id ]
    docs.push
    ( Object.assign
      ( {}
      , parent
      , { [ key ]: list, [ skey ]: _id } )
    )
  }
  output ( { docs } )
}
