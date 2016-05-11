import './style.scss'
import { Component } from '../Component'
import Status from '../Status'

export default Component
( { status: [ 'status' ]
  }
, ( { state, signals } ) => {
    const l = state.status || []
    const s = l [ 0 ]

    return <div id='statusBar'>
        { s ? <Status type={s.type} message={s.message}/> : '' }
      </div>
  }
)
