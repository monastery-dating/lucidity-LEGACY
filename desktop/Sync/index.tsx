import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'

const ICON = 'fa-exchange'

const BASE = { Sync: true, fa: true, [ ICON ]: true }
const SYNC_TO_FA =
{ paused: Object.assign ( {}, BASE, { paused: true } )
, active: Object.assign ( {}, BASE, { active: true } )
, complete: Object.assign ( {}, BASE, { complete: true } )
, offline: Object.assign ( {}, BASE, { offline: true } )
, error: Object.assign ( {}, BASE, { error: true } )
}

const syncToClass =
( sync ) => {
  return { fa: true, [ sync || '' ]: true }
}

export const Sync = Component
( { status: [ '$sync', 'status' ]
  }
, ( { state } ) => (
    <div class={ SYNC_TO_FA [ state.status || 'paused' ] }/>
  )
)
