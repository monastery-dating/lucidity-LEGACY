export default function
( { state } ) {
  state.set ( [ 'project', '$editing' ], false )
  state.set ( [ 'project', '$saving' ], true )
}
