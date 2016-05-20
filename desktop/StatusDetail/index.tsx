import './style.scss'
import { Component } from '../Component'
import { StatusType } from '../../modules/Status'
import { Status } from '../Status'

export const StatusDetail = Component
( { detail: [ '$status', 'detail' ]
  , visible: [ '$status', 'showDetail' ]
  }
, ( { state, signals } ) => {
    const status: StatusType = state.detail || {}
    return <div class={{ StatusDetail: true, active: state.visible }}>
        <div class='bar'>
          <Status status={ status } class='title'/>
        </div>
        <div class='wrap'>
          { (status.detail || []).map
            ( ( s ) => <div class='entry'>{ s }</div>
            )
          }
        </div>
      </div>
  }
)
