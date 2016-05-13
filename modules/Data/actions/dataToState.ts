import { Db } from '../types/db.type'

export const dataToState =
( { state, input } ) => {
  state.set ( input.path, input.data )
}
