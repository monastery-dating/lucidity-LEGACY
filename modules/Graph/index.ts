import { uimap, uimapType } from './helper'

export interface GraphServicesType {
  uimap: uimapType
}

export const Graph =
( options = {}) => {
  return (module, controller) => {
    module.addServices
    ( { uimap
      }
    )

    return {} // meta information
  }
}
