import '../tests'
import { run } from '../runner'

export const runall =
( { state, output } ) => {
  run ( ( stats ) => {
    output.success ( stats )
  })
}

runall [ 'async' ] = true
