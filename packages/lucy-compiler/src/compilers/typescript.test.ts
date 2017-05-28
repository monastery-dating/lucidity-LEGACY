import { source } from '../test'
import { compile } from './typescript'
import { isCompileSuccess } from './types'

it ( 'should compile to js', () => {
  expect
  ( isCompileSuccess
    ( compile ( source ( 'source1.ts' ) )
    )
  )
  .toEqual
  ( true
  )
})