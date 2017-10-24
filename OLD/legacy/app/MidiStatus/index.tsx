import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'

const ICON = 'fa-plug'

const BASE = { MidiStatus: true, fa: true, [ ICON ]: true }
const STATUS =
{ on: Object.assign ( {}, BASE, { paused: true } )
, active: Object.assign ( {}, BASE, { active: true } )
, off: Object.assign ( {}, BASE, { offline: true } )
, error: Object.assign ( {}, BASE, { error: true } )
}

const syncToClass =
( sync ) => {
  return { fa: true, [ sync || '' ]: true }
}

export const MidiStatus = Component
( { status: [ '$midi', 'status' ]
  }
, ( { state } ) => (
    <div class={ STATUS [ state.status || 'off' ] }/>
  )
)
