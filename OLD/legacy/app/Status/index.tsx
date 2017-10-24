import './style.scss'
import { StatusType } from '../../modules/Status'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'

export const Status = Component
( {}
, ( { props, signals }: ContextType ) => {
    const status: StatusType = props.status
    const toggleDetail = ( e ) => {
      signals.$status.toggledDetail
      ( { detail: status
        }
      )
    }
    const klass = Object.assign
    ( {}, props.class || {}
    , { Status: true, [ status.type ]: true }
    )
    return <div class={ klass }
      on-click={ toggleDetail }>
      { props.nosvg ? '' :
        <svg height='12' width='18'>
          <circle cx='5.5' cy='6.5' r='5' class='outer'/>
          <circle cx='5.5' cy='6.5' r='3' class='inner'/>
        </svg>
      }
      { status.message }
    </div>
  }
)
