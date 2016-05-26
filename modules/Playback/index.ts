export * from './helper/PlaybackHelper'

export const Playback =
( options = {} ) => {
  return (module, controller) => {
    module.addState
    ( { $main: function () {}
      , $visible: true
      }
    )

    return {} // meta information
  }
}
