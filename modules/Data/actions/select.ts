import { ContextType } from '../../context.type'
export const selectAction =
( { state
  , input: { doc, select }
  , output
  } : ContextType
) => {
  // if the saved element is not selected, select it

  // FIXME: needs testing
  if ( select ) {
    const type = select.type

    const _rev = state.get ( [ 'data', 'main', type, '_rev' ] )

    output.select
    ( { doc:
        { type: 'main'
        , _id: type
        , value: select._id
        , _rev
        }
      }
    )
  }
  else if ( doc ) {
    // with a 'doc' as argument, we only save if there is no
    // element with this type selected.
    // We ignore 'docs' as we suppose in this case 'select' is
    // part of the db write.
    const type = doc.type

    const row = state.get ( [ 'data', 'main', type ] )

    if ( !row ) {
      output.select
      ( { doc:
          { type: 'main'
          , _id: type
          , value: doc._id
          }
        }
      )
    }
  }
}

selectAction [ 'outputs' ] = [ 'select' ]

// Cerebral type checking
const checkDoc = ( doc ) => {
  return typeof doc._id === 'string'
      && typeof doc.type === 'string'
}

selectAction [ 'input' ] = ( value ) => {
  if ( value.doc ) {
    return checkDoc ( value.doc )
  }
  else if ( value.select ) {
    return checkDoc ( value.doc )
  }
  else {
    return false
  }
}
