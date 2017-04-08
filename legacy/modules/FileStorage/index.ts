export * from './signals/start'
export * from './signals/stop'
import { FileChanged } from './helper/types'

type FsStatus = 'paused' | 'offline' | 'error' | 'active'

export interface FileStorageSignalsType {
  changed ( opt: { type: FsStatus, message?: string } )
  file ( opt: FileChanged )
  library ( opt: { path: string, op: string, source: string } )
}

import { changed } from './signals/changed'
import { file } from './signals/file'
import { library } from './signals/library'
import { start } from './helper/FileStorageHelper'

export const FileStorage =
(options = {}) => {
  return (module, controller) => {
    module.addState
    ( { status: 'offline'
      }
    )

    module.addSignals
    ( { changed
      , file
      , library
      }
    )

    start ( { controller } )

    return {} // meta information
  }
}
