export default (options = {}) => {
  return (module, controller) => {
    module.addState
    ( { $main: function () {}
      , $visible: true
      }
    )

    module.addSignals
    ( {
      }
    )

    return {} // meta information
  }
}
