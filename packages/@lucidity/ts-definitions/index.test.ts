import { definitions } from './'

it ( 'should build', () => {
  expect
  ( Object.keys ( definitions ).sort ()
  )
  .toEqual
  ( [ 'lib.d', 'lucidity' ]
  )
})