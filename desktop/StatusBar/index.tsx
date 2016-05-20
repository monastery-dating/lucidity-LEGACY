import './style.scss'
import { Component } from '../Component'
import { Status } from '../Status'

export const StatusBar = Component
( { status: [ '$status', 'list' ]
  }
, ( { state, signals } ) => {
    const l = state.status || []
    const s = l [ 0 ]

    return <div class='StatusBar'>
        { s ? <Status status={s}/> : '' }
      </div>
  }
)
