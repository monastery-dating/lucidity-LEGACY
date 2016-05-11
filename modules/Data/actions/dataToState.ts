import { Db } from '../types/db.type'

const action = ( { state, input } ) => {
  state.set ( input.path, input.data )
}

export default action
