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
let lastsize
let lastmode

export const Playback = Component
( { graph: [ 'scene', 'graph' ]
  , drop: [ '$dragdrop', 'drop' ] // react to drag op
  , drag: [ '$dragdrop', 'drag' ]
  // The state has ctrl values for the currently selected block.
  , select: [ '$block']
  , ctrl: [ '$playback', 'ctrl' ]
  , size: [ '$playback', 'size' ]
  , mode: [ '$playback', 'mode' ]
  , tab: [ '$blocktab' ]
  }
, ( { state, signals } ) => {
    const w = 320
    const h = 180
    const hair = 6
    const usedh = state.mode === 'normal' ? 2 * ( 4 + hair ) + h : 0
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
        // Share scrubber with editor.
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
          if ( lastsize !== state.size || lastmode !== state.mode ) {
            // force resize
            lastsize = state.size
            lastmode = state.mode
            PlaybackHelper.init ( graph, context, cache, helpers )
            PlaybackHelper.update ( cache, context )
          }
          // New scrubber is ready: update editor
          if ( editor ) {
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
