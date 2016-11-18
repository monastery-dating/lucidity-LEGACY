import {input, when} from 'cerebral/operators'
import changeText from '../actions/changeText'
import handleSelect from './handleSelect'
import processOps from '../actions/processOps'

export default [
  changeText,
  when(input`ops`), {
    true: [processOps],
    false: []
  },
  ...handleSelect
]
