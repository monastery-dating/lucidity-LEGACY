export * from './add'
export * from './editable'
export * from './modal'
export * from './pane'
export * from './types'
export * from './makeId'

import { set, add } from './common'
import { finishedEditing } from './editable'

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
      , finishedEditing
      , set
      }
    )

    return {} // meta information
  }
}
