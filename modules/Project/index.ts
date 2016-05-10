import changed from './signals/changed'
import edit from './signals/edit'

export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( { title: 'Empty project'
      , $editing: false
      }
    )

    module.addSignals
    ( { changed
      , edit
      }
    )

    return {} // meta information
  }
}

interface AllSignals {
  changed ( { title: string } )
  edit ( {} )
}

export interface ProjectSignals {
  project: AllSignals
}
