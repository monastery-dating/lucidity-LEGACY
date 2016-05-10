import '../tests'
import { run } from '../runner'

const runall = ( { state, output } ) => {
  run ( ( stats ) => {
    output.success ( stats )
  })
}

runall [ 'async' ] = true
export default runall
