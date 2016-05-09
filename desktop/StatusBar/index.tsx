import './style.scss'
import { Component } from '../Component'

export default Component
( { type:    [ 'status', 'type' ]
  , message: [ 'status', 'message' ]
  }
, ( { state, signals } ) => {

    return <div id='statusBar'
      className={ state.type }
      on-click={ () =>
        signals.status.changed
        ( { type: state.type == 'error' ? 'ok' : 'error'
          , message: 'Test'
          }
        )
      }>

      <svg height='12' width='14'>
        <circle cx='5.5' cy='6.5' r='5' className='outer'/>
        <circle cx='5.5' cy='6.5' r='3' className='inner'/>
      </svg>
      { state.message }
    </div>
  }
)
