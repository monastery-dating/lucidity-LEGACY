import './style.scss'
import { Component } from '../Component'

export const Playback = Component
( { main: [ 'playback', '$main' ]
  }
, ( { state, signals } ) => {
    const w = 320
    const h = 180
    const hair = 6
    const usedh = 2 * ( 4 + hair ) + h
    const portStyle =
    { top: 4 + hair + 'px'
    , left: 4 + hair + 'px'
    , width: w + 'px'
    , height: h + 'px'
    }
    return <div class='Playback' style={{ height: usedh + 'px' }}>
      <div class='Screen' style={portStyle}>
        <svg width={w+2+2*hair} height={h+2+2*hair} class='tv'
          style={{ marginLeft: -1-hair, marginTop: -1-hair }}>

          <rect x={0.5-1} y={0.5+hair} width={w+3+2*hair} height={h+1}/>
          <rect x={0.5+hair} y={0.5-1} width={w+1} height={h+3+2*hair}/>

        </svg>
      </div>
    </div>
  }
)
