import {input, when} from 'cerebral/operators'
import handleSelect from '../actions/handleSelect'
import processOps from '../actions/processOps'

export default [
  handleSelect,
  when(input`ops`), {
    true: [processOps],
    false: []
  }
]
