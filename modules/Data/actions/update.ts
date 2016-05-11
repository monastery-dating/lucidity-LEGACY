import { Db } from '../types/db.type'

const action = ( { state, input } ) => {

  if ( input.deleted ) {
    // FIXME: Handle removal
  }
  else {
    const doc = input.doc
    const { _id, type } = doc

    state.set ( [ 'data', type, _id ], doc )

    const cid = state.get ( 'data.main.projectId.value' )
    if ( type === 'project' && _id === cid ) {
      state.set ( [ 'project', '$saving' ], false )
    }
  }

}

export default action
