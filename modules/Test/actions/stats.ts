export const stats =
( { state, input, output } ) => {
  const m = [ `${input.passCount}/${input.testCount} tests pass` ]
  if ( input.failCount ) {
    m.push ( `${input.failCount} fail`)
  }

  if ( input.pendingCount ) {
    m.push ( `${input.pendingCount} pending`)
  }

  const s:any = { message: m.join ( ',' ) }

  if ( input.passCount === input.testCount ) {
    s.type = 'success'
  }
  else if ( input.failCount ) {
    s.type = 'error'
  }
  else {
    s.type = 'warn'
  }

  output.success ( { status: s } )
}
