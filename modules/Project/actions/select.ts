import { ContextType } from '../../context.type'

export default
( { state, input, output }: ContextType ) => {
  const _rev = state.get ( [ 'data', 'main', 'project' ] )

  output
  ( { doc:
      { type: 'main'
      , _id: 'project'
      , value: input._id
      , _rev
      }
    }
  )
}
