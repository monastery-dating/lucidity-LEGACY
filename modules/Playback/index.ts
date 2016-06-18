export * from './helper/PlaybackHelper'
export interface PlaybackSignalsType {

}

export const Playback =
( options = {} ) => {
  return (module, controller) => {
    module.addState
    ( { mode: 'normal'
      }
    )

    return {} // meta information
  }
}
