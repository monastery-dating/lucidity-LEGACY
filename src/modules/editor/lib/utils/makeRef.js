import {v4} from 'uuid'

export default function makeRef () {
  return v4().substr(0, 5)
}
