import { Control, SliderCallback, PadCallback } from '../types/lucidity'

interface SetControl {
  ( values: number[] ):void
}

export interface PlaybackControl {
  type: string
  labels: string[]
  values: number[]
  set: SetControl
}

interface ControlHolder {
  // always present when called but this is to make
  // it compatible with NodeCache
  controls?: PlaybackControl[]
}

export module ControlHelper {
  export const make =
  ( nc: ControlHolder
  ): Control => {
    const Slider =
    ( name: string, callback: SliderCallback ) => {
      const values = [ 0 ]
      const set: SetControl = ( [ v ] ) => {
        values [ 0 ] = v
        callback ( v )
      }
      nc.controls.push
      ( { type: 'Slider'
        , values
        , labels: [ name ]
        , set
        }
      )
    }
    const Pad =
    ( namex: string
    , namey: string
    , callback: PadCallback
    ) => {
      const values = [ 0, 0 ]
      const set: SetControl = ( [ x, y ] ) => {
        values [ 0 ] = x
        values [ 1 ] = y
        callback ( x, y )
      }
      nc.controls.push
      ( { type: 'Pad'
        , values
        , labels: [ namex, namey ]
        , set
        }
      )
    }
    return { Slider, Pad }
  }
}
