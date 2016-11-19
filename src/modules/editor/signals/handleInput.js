import {state, unset} from 'cerebral/operators'
import {input, when} from 'cerebral/operators'
import changeText from '../actions/changeText'
import processOps from '../actions/processOps'

export default [
  changeText,
  when(input`ops`), {
    // This means that we had to strip chars. Need to reset toolbox:
    true: [
      unset(state`editor.$toolbox`),
      processOps
    ],
    false: []
  }
]
