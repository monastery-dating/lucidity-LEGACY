import './style.scss'
import { Component } from '../Component'

export default Component
( { type:    [ 'status', 'type' ]
  , message: [ 'status', 'message' ]
  }
, ( { state, signals } ) => {

    return <div id='statusBar'
      class={ state.type }
      on-click={ () =>
        signals.status.changed
        ( { type: state.type == 'error' ? 'ok' : 'error'
          , message: 'Test'
          }
        )
      }>

      <svg height='12' width='14'>
        <circle cx='5.5' cy='6.5' r='5' class='outer'/>
        <circle cx='5.5' cy='6.5' r='3' class='inner'/>
      </svg>
      { state.message }
    </div>
  }
)
