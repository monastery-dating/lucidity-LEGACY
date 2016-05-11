import changed from './signals/changed'

export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( []
    )

    module.addSignals
    ( { changed
      }
    )

    return {} // meta information
  }
}
