import './style.scss'
import { Component } from '../Component'
import { PlaybackHelper, PlaybackCache } from '../../modules/Playback'

const cache: PlaybackCache = { nodecache: {} }

export const Playback = Component
( { main: [ 'playback', '$main' ]
  , graph: [ 'scene', 'graph' ]
  , blocksById: [ 'data', 'block' ]
  }
, ( { state, signals } ) => {
    const w = 320
    const h = 180
    const hair = 6
    const usedh = 2 * ( 4 + hair ) + h
    const usedw = 2 * ( 4 + hair ) + w
    const portStyle =
    { top: 4 + hair + 'px'
    , left: 4 + hair + 'px'
    , width: w + 'px'
    , height: h + 'px'
    }

    if ( state.graph ) {
      const func = PlaybackHelper.compile
      ( state.graph, state.blocksById, cache )

      console.log ( 'play once' )
      try {
        const context = {}
        func ( context )
      }
      catch ( err ) {
        console.error ( err )
      }
    }


    return <div class='Playback' style={{ height: usedh + 'px' }}>
      <div class='wrap'
        style={{ height: usedh + 'px'
               , width: usedw + 'px' }}>
        <div class='Screen' style={portStyle}>
          <div id='screen'></div>
          <svg width={w+2+2*hair} height={h+2+2*hair} class='tv'
            style={{ marginLeft: -1-hair, marginTop: -1-hair }}>

            <rect x={0.5-1} y={0.5+hair} width={w+3+2*hair} height={h+1}/>
            <rect x={0.5+hair} y={0.5-1} width={w+1} height={h+3+2*hair}/>

          </svg>
        </div>
      </div>
    </div>
  }
)
