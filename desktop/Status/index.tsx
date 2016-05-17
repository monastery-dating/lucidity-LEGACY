import './style.scss'
import { Component } from '../Component'

export const Status = Component
( {}
, ( { props } ) => {

    return <div class={{ Status: true, [ props.type ]: true }}>
      { props.nosvg ? '' :
        <svg height='12' width='18'>
          <circle cx='5.5' cy='6.5' r='5' class='outer'/>
          <circle cx='5.5' cy='6.5' r='3' class='inner'/>
        </svg>
      }
      { props.message }
    </div>
  }
)
