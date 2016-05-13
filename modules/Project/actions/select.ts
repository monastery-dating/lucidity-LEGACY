import { ContextType } from '../../context.type'

export default
( { state, input, output }: ContextType ) => {
  const _rev = state.get ( [ 'data', 'main', 'projectId' ] )

  output
  ( { doc:
      { type: 'main'
      , _id: 'projectId'
      , value: input._id
      , _rev
      }
    }
  )
}
