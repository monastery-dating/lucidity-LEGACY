const save: any = function
( { state, output } ) {
  state.set ( [ 'project', '$editing' ], false )
  state.set ( [ 'project', '$saving' ], true )
  setTimeout
  ( () => output.success ( { save: 'ok' } )
  , 10
  )
}

save.async = true

export default save
