import './style.scss'
import { Component } from '../Component'
import { PlaybackHelper, PlaybackCache } from '../../modules/Playback'
import { DragDropType, DragStartType } from '../../modules/DragDrop'

const cache: PlaybackCache = {}
const context = PlaybackHelper.mainContext ()

/* ====== PLAYBACK LIBS ======= */
import * as THREE from 'three'
const PRELOADED = { THREE }
/* ====== PLAYBACK LIBS ======= */

export const Playback = Component
( { graph: [ 'scene', 'graph' ]
  , drop: [ '$dragdrop', 'drop' ] // react to drag op
  , drag: [ '$dragdrop', 'drag' ]
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

    const ownerType = 'scene'
    const drop: DragDropType = state.drop
    const drag: DragStartType = state.drag

    let graph = state.graph
    if ( drop && drop.ownerType === ownerType ) {
      graph = drop.graph
    }
    else if ( drag && drag.ownerType === ownerType ) {
      graph = drag.rgraph
    }

    let update
    if ( graph ) {
      const require = ( name ) => PRELOADED [ name ]
      // TODO: Get project graph and branch with scene...
      update = () => {
        PlaybackHelper.compile ( graph, cache )
        PlaybackHelper.init ( cache, { require } )
        try {
          cache.main ( context )
        }
        catch ( err ) {
          console.error ( err )
        }
      }
    }


    return <div class='Playback' style={{ height: usedh + 'px' }} hook-update={ update }>
      <div class='wrap'
        style={{ height: usedh + 'px'
               , width: usedw + 'px' }}>
        <div class='Screen' style={portStyle}>
          <svg width={w+2+2*hair} height={h+2+2*hair} class='tv'
            style={{ marginLeft: -1-hair, marginTop: -1-hair }}>

            <rect x={0.5-1} y={0.5+hair} width={w+3+2*hair} height={h+1}/>
            <rect x={0.5+hair} y={0.5-1} width={w+1} height={h+3+2*hair}/>

          </svg>

          <div id='screen'></div>

        </div>
      </div>
    </div>
  }
)
