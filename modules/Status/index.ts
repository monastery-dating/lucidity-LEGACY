import changed from './signals/changed'

export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( { type: 'info'
      , message: ''
      }
    )

    module.addSignals
    ( { changed
      }
    )

    return {} // meta information
  }
}
