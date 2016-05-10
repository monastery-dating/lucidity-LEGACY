export default function
( { state, input: { title } } ) {
  state.set ( [ 'project', 'title' ], title )
}
