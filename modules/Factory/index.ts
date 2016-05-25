export * from './add'
export * from './editable'
export * from './modal'
export * from './pane'
export * from './types'
export * from './makeId'

import { set, add } from './common'

export const Factory =
( options = {} ) => {
  return (module, controller) => {

    module.addState
    ( { editing: false // would contain the path of edited element
        // path/of/edit: { value: newValue, saving: Boolean }
      }
    )

    // FIXME: none of these should exist.
    module.addSignals
    ( { add
      , set
      }
    )

    return {} // meta information
  }
}
