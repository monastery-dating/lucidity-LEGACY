import {input, when} from 'cerebral/operators'
import createBlock from '../actions/createBlock'

export default [
  when(input`selection.hasSelection`), {
    true: [/* TODO: delete selected text */],
    false: []
  },
  createBlock
]
