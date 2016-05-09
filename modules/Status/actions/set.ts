export default function
( { state, input: { type, message } } ) {
  state.set ( 'status', { type, message } )
}
