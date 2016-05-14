export * from './editable'

import { set, add } from './common'
import { changed } from './editable'

export const Factory =
( options = {} ) => {
  return (module, controller) => {

    module.addState
    ( { editing: false // would contain the path of edited element
        // path/of/edit: { value: newValue, saving: Boolean }
      }
    )

    module.addSignals
    ( { add
      , changed
      , set
      }
    )

    return {} // meta information
  }
}
