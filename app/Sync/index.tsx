import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'

const ICON = 'fa-exchange'

const BASE = { Sync: true, fa: true, [ ICON ]: true }
const STATUS =
{ paused: Object.assign ( {}, BASE, { paused: true } )
, active: Object.assign ( {}, BASE, { active: true } )
, complete: Object.assign ( {}, BASE, { complete: true } )
, offline: Object.assign ( {}, BASE, { offline: true } )
, error: Object.assign ( {}, BASE, { error: true } )
}

export const Sync = Component
( { status: [ '$sync', 'status' ]
  }
, ( { state } ) => (
    <div class={ STATUS [ state.status || 'paused' ] }/>
  )
)
