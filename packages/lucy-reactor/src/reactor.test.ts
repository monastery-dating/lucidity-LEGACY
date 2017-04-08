/* global it expect describe */
import { get, reactor, set } from './reactor'

describe ( 'when', () => {
  it ( 'should trigger hook on value change', () => {
    const { register, runHooks, state } = reactor ()
    const { when } = register ( 'foo' )
    when ( state`midi.note.64` )
    .set ( value => state`foo.${ value > 0 ? 'start' : 'release' }`, state`time` )

    set ( state`time`, 10 )
    set ( state`midi.note.64`, 35 )
    runHooks ()

    set ( state`time`, 20 )
    set ( state`midi.note.64`, 0 )
    runHooks ()

    expect
    ( get ( state`foo.start` ) )
    .toEqual
    ( 10 )

    expect
    ( get ( state`foo.release` ) )
    .toEqual
    ( 20 )

  })
})
