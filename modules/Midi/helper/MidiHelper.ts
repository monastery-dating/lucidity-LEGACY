let midi
interface NewNavigator extends Navigator {
  requestMIDIAccess: any
}

const receive =
( m ) => {
  console.log ( m )
}

const nav = <NewNavigator>navigator

export module MidiHelper {

  export const init =
  () => {
    return new Promise ( ( resolve, reject ) => {
      if ( nav.requestMIDIAccess ) {
        nav.requestMIDIAccess ()
        .then ( ( m ) => {
          midi = m
          for ( const input of m.inputs.values () ) {
            console.log ( input.name, input )
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
