import './style.scss'
import { Component } from '../Component'
import { PlaybackHelper, PlaybackCache } from '../../modules/Playback'
import { CodeHelper } from '../../modules/Code/helper/CodeHelper'
import { DragDropType, DragStartType } from '../../modules/DragDrop'

const cache: PlaybackCache = { nodecache: {} }
const context = PlaybackHelper.mainContext ()
let uicontrols: any = null

/* ====== PLAYBACK LIBS ======= */
import * as THREE from 'three'
const PRELOADED = { THREE }
/* ====== PLAYBACK LIBS ======= */
const helpers =
{ require: ( name ) => PRELOADED [ name ]
}

type NumberArray = number[]
type Matrix = NumberArray[]

let editor

export const Playback = Component
( { graph: [ 'scene', 'graph' ]
  , drop: [ '$dragdrop', 'drop' ] // react to drag op
  , drag: [ '$dragdrop', 'drag' ]
  // The state has ctrl values for the currently selected block.
  , select: [ '$block']
  , ctrl: [ '$playback', 'ctrl' ]
  , tab: [ '$blocktab' ]
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

    if ( !editor ) {
      editor = CodeHelper.getEditor ()
      if ( editor ) {
        cache.scrubber = editor.options.scrubber
      }
    }

    const select = state.select
    const playbackctrl: Matrix = state.ctrl
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

      // TODO: Get project graph and branch with scene...
      update = () => {
        try {
          if ( select && select.ownerType === 'scene' ) {
            cache.scrub = select.id
          }
          else {
            cache.scrub = null
          }
          PlaybackHelper.run ( graph, context, cache, helpers )
          // New scrubber is ready: update editor
          if ( editor ) {
            console.log ( 'WRITE SCRUB' )
            // New marks ready. Update editor.
            CodeHelper.scrubMark ( editor )
          }

          if ( select && select.ownerType === 'scene' && state.tab === 'controls' ) {
            // FIXME: only on changes to ctrl
            const nodeId = select.nodeId
            const nc = cache.nodecache [ nodeId ]
            const controls = nc.controls
            if ( controls !== uicontrols ) {
              uicontrols = controls
              // Prepare ui
              const controlsm = controls.map ( ( c ) => ( { type: c.type, labels: c.labels, values: Object.assign ( [], c.values ) } ) )

              signals.block.controls
              ( { controls: controlsm } )
            }

            if ( playbackctrl ) {
              // Get values from UI
              for ( let i = 0; i < controls.length; ++i ) {
                const ctrl = controls [ i ]
                const values = playbackctrl [ i ]
                if ( values ) {
                  ctrl.set ( values )
                }
              }
            }
          }
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
