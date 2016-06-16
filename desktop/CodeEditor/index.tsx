import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { CodeHelper, wscrub } from '../../modules/Code/helper/CodeHelper'

// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/dialog/dialog.css'

// UGLY UI state...
let code = null
let source

interface GlobalScrubber {
  values: number[]
  init (): void
}

const floatRe = /\./

const scrubdown = ( e: MouseEvent, el: HTMLElement, i, save ) => {
  // start click
  const sx = e.clientX
  const sy = e.clientY
  // original value
  const sv = wscrub.values [ i ]
  el.classList.add ( 'scrubbing' )
  // current value
  let v = sv
  const sfloat = floatRe.test ( el.innerHTML )
  // move callback on global window (like drag)
  const mousemove = ( e: MouseEvent ) => {
    e.preventDefault ()
    const isfloat = e.altKey ? !sfloat : sfloat
    // scale to -0.5, 0.5 in screen
    const dx = ( e.clientX - sx ) / ( window.innerWidth / 2 )
    const dy = - ( e.clientY - sy ) / ( window.innerHeight / 2 )
    if ( isfloat ) {
      // FLOAT
      // get dim as approx 10^2 .... 10^-2 .... 10^2
      const dimx = Math.pow ( 10, Math.abs ( 6 * dx ) - 2 )
      const dimy = Math.pow ( 10, Math.abs ( 6 * dy ) - 2 )
      const dist = ( dx > 0 ? 1 : -1 ) * dimx
                 + ( dy > 0 ? 1 : -1 ) * dimy
      const v = (sv + dist).toFixed ( 4 )
      wscrub.values [ i ] = parseFloat ( v ) // ensures str === live value
      el.innerHTML = v
    }
    else {
      // INT
      // get dim as approx 10^2 .... 1 .... 10^2
      const dimx = Math.pow ( 10, Math.abs ( 2 * dx ) )
      const dimy = Math.pow ( 10, Math.abs ( 2 * dy ) )
      const dist = ( dx > 0 ? 1 : -1 ) * dimx
                 + ( dy > 0 ? 1 : -1 ) * dimy
      const v = (sv + dist).toFixed ( 0 )
      wscrub.values [ i ] = parseInt ( v )
      el.innerHTML = v
    }
    try {
      wscrub.init ()
    }
    catch ( err ) {
      console.log ( err )
    }
  }

  const mouseup = ( e ) => {
    window.removeEventListener ( 'mousemove', mousemove )
    window.removeEventListener ( 'mouseup', mouseup )
    // move mouse back
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
        const to   = { line: i, ch: oline.length }

        code.replaceRange ( txt, from, to )
        // Save is done with 'changes' detection.
        // save ()
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
    const prev = nb.previousElementSibling
    if ( prev
         && prev.classList.contains ( 'cm-operator' )
         && prev.innerHTML === '-' ) {
           nb.innerHTML = '-' + nb.innerHTML
           prev.parentNode.removeChild ( prev )
    }

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

let lock // prevent save to update content while we have focus
let block

export const CodeEditor = Component
( {}
, ( { props, signals }: ContextType ) => {
    block = props.block
    const save = () => {
      // Save callback
      signals.block.source
      ( { value: code.getValue () } )
    }

    const create = ( _, { elm } ) => {
      if ( code === null ) {
        code = false
        setTimeout
        ( () => {
            code = CodeHelper.editor
            ( elm
            , block.source
            )
            code.on ( 'focus', () => {
              lock = block.id
            })
            code.on ( 'blur', () => {
              lock = false
            })
            code.on ( 'changes', save )
          }
        , 100
        )
      }
    }

    if ( block.id !== lock ) {

    }

    if ( source !== block.source && code ) {
      source = block.source
      if ( !lock || lock !== block.id ) {
        code.setValue ( block.source || '' )
        if ( lock ) {
          lock = block.id
        }
      }
      // Scrub. This could happen on 'blur' if it is confusing.
      scrubNumbers ( save )
    }

    return <div class='CodeEditor' style={ props.style }>
        <div class='codeholder' hook-create={ create }></div>
      </div>
  }
)
