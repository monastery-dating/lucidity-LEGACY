let midi
interface NewNavigator extends Navigator {
  requestMIDIAccess: any
}

interface MidiMessage {
  data: Uint8Array
}

const makeValues =
( chan, val ) => {
  const notes = []
  for ( let i = 0; i < 128; ++i ) {
    notes [ i ] = val
  }
  return notes
}

const makeChannels =
( count, clbk, val ) => {
  const channels = []
  for ( let i = 1; i <= count; ++i ) {
    channels [ i ] = clbk ( i, val )
  }
  return channels
}

const mstate =
{ note: makeChannels ( 16, makeValues, 0 )
, ctrl: makeChannels ( 16, makeValues, 0 )
}

const NOTE_OFF = 0x80
const NOTE_ON  = 0x90
const CTRL     = 0xB0

const receive =
( m: MidiMessage ) => {
  const s = m.data [ 0 ]
  const c = 1 + (s & 0x0f)
  const type = s & 0xf0
  const key = m.data [ 1 ] & 0x7f
  const value = m.data [ 2 ] & 0x7f
  console.log ( type, key, value )
  switch ( type ) {
    case NOTE_OFF:
      mstate.note [ c ] [ key ] = 0
      break
    case NOTE_ON:
      mstate.note [ c ] [ key ] = value
      break
    case CTRL:
      mstate.ctrl [ c ] [ key ] = value
      break
  }
}

const nav = <NewNavigator>navigator

export module MidiHelper {

  export const midiState =
  () => {
    return mstate
  }

  export const init =
  () => {
    return new Promise ( ( resolve, reject ) => {
      if ( nav.requestMIDIAccess ) {
        nav.requestMIDIAccess ()
        .then ( ( m ) => {
          midi = m
          for ( const input of m.inputs.values () ) {
            input.onmidimessage = receive
          }
        })
        .catch ( ( err ) => {
          reject ( `NO MIDI (${err})` )
        })

        resolve ( 'MIDI support detected' )
      }
      else {
        reject ( 'NO MIDI support' )
      }
    })
  }
}
