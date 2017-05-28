import {v4} from 'uuid'

export function makeRef () {
  return v4().substr(0, 5)
}
