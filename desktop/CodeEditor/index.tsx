import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import * as CodeMirror from 'codemirror'

// JS mode
import 'codemirror/mode/javascript/javascript'
// CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'

// UGLY UI state...
let code = null
let source

interface GlobalScrubber {
  values: number[]
  init (): void
}

// FIXME: Can we cleanly remove this global ?
const wscrub: GlobalScrubber = window [ 'LUCY_SCRUB' ]

const scrubdown = ( e: MouseEvent, el: HTMLElement, i, save ) => {
  // start click
  const sx = e.clientX
  const sy = e.clientY
  // original value
  const sv = wscrub.values [ i ]
  el.classList.add ( 'scrubbing' )
  // current value
  let v = sv
  const mousemove = ( e ) => {
    // moving on global window (like drag)
    e.preventDefault ()
    // scale to -0.5, 0.5 in screen
    const dx = ( e.clientX - sx ) / ( window.innerWidth / 2 )
    const dy = - ( e.clientY - sy ) / ( window.innerHeight / 2 )
    // get dim as 10^2 .... 10^-1 .... 10^2
    const dimx = Math.pow ( 10, Math.abs ( 6 * dx ) - 2 )
    const dimy = Math.pow ( 10, Math.abs ( 6 * dy ) - 2 )
    const dist = ( dx > 0 ? 1 : -1 ) * dimx
               + ( dy > 0 ? 1 : -1 ) * dimy
    const v = (sv + dist).toFixed ( 4 )
    wscrub.values [ i ] = parseFloat ( v )
    try {
      wscrub.init ()
    }
    catch ( err ) {
      console.log ( err )
    }
    el.innerHTML = v
  }

  const mouseup = ( e ) => {
    window.removeEventListener ( 'mousemove', mousemove )
    window.removeEventListener ( 'mouseup', mouseup )
    el.classList.remove ( 'scrubbing' )
    document.body.style.cursor = 'auto'
    // COMMIT CHANGES
    // FIXME: make sure we commit source code change..
    // cm.replaceRange...
    // This is an ugly hack until we find a way to compute the range...
    const lines = document.getElementsByClassName ( 'CodeMirror-line' )
    const line = el.parentElement.parentElement
    for ( let i = 0; i < lines.length; ++i ) {
      if ( lines [ i ] === line ) {
        const txt = line.textContent
        const doc = code.getDoc ()
        const oline = doc.getLine ( i )
        const from = { line: i, ch: 0 }
        const to   = { line: i, ch: oline.length - 1 }

        console.log ( oline )
        code.replaceRange ( txt, from, to )
        save ()
      }
    }
  }

  document.body.style.cursor = 'move'
  window.addEventListener ( 'mousemove', mousemove )
  window.addEventListener ( 'mouseup', mouseup )
}

const scrubNumbers = ( save ) => {
  const codediv = document.getElementsByClassName ( 'CodeMirror-code' ) [ 0 ]
  const numbers = codediv.getElementsByClassName ( 'cm-number' )

  for ( let i = 0; i < numbers.length; ++i ) {
    const nb = numbers [ i ]
    // FIXME: Make sure we do not have a unary - before number
    // could this go wrong ?
    nb.addEventListener ( 'mousedown', ( e: MouseEvent ) => {
      e.preventDefault ()
      e.stopPropagation ()
      scrubdown ( e, nb as HTMLElement, i, save )
    })
    nb.classList.add ( 'scrub' )
  }
  // In playback, if a block in the graph is selected we tell the PlaybackHelper to use scrub for the given block.
  // We should now alter the graph to use scrub
  // instead of numbers ?
}

export const CodeEditor = Component
( {}
, ( { props, signals }: ContextType ) => {
    const block = props.block

    const create = ( _, { elm } ) => {
      if ( code === null ) {
        code = false
        setTimeout
        ( () => {
            code = CodeMirror
            ( elm
            , { value: block.source || ''
              , lineNumbers: true
              , theme: 'bespin'
              , mode: 'javascript'
              }
            )
            code.on
            ( 'blur', () => {
                signals.block.source
                ( { value: code.getValue () } )
              }
            )
          }
        , 100
        )
      }
    }

    if ( source !== block.source && code ) {
      source = block.source
      code.setValue ( block.source || '' )
      // Scrub
      scrubNumbers ( () => {
        // Save callback
        signals.block.source
        ( { value: code.getValue () } )
      })
    }

    return <div class='CodeEditor' style={ props.style }>
        <div hook-create={ create }></div>
      </div>
  }
)
