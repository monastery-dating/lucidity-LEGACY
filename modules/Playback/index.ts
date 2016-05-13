export const Playback =
( options = {} ) => {
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
