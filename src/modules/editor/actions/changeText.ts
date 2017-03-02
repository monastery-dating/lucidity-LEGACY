import stripZeroWidthChar from '../lib/stripZeroWidthChar'

const BASE_PATH = 'editor.composition.i'

export function changeText ( { state, props } ) {
  const path =
  `${ BASE_PATH }.${
    props.selection.anchorPath.join ( '.i.' )
  }.i`
  const { selection, value } = stripZeroWidthChar
  ( props.value, props.selection )
  state.set ( path, value )

  if ( selection ) {
    return (
      { ops:
        [ { op: 'select'
          , value: selection
          }
        ]
      }
    )
  }
}
