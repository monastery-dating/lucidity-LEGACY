import { ActionContextType } from '../../context.type'
import { Db } from '../types/db.type'

export const dataToState =
( { state, input }: ActionContextType ) => {
  state.set ( input.path, input.data )
}
