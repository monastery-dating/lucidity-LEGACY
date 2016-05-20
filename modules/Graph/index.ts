export * from './helper/uimap'
export * from './types'

import { mockGraph } from './mock/graph'

export const Graph =
( options = {}) => {
  return (module, controller) => {
    module.addState
    ( mockGraph
    )

    return {} // meta information
  }
}
