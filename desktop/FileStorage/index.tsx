import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'

const ICON = 'fa-file-text-o'

const BASE = { FileStorage: true, fa: true, [ ICON ]: true }
const STATUS =
{ on: Object.assign ( {}, BASE, { paused: true } )
, active: Object.assign ( {}, BASE, { active: true } )
, offline: Object.assign ( {}, BASE, { offline: true } )
, error: Object.assign ( {}, BASE, { error: true } )
}

export const FileStorage = Component
( { status: [ '$filestorage', 'status' ]
  }
, ( { state } ) => (
    <div class={ STATUS [ state.status || 'offline' ] }/>
  )
)
