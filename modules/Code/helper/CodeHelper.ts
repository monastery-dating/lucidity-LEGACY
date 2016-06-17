import { BlockType } from '../../Block'
import * as LanguageService from './LanguageService'

import * as ts from 'typescript'
import * as CodeMirror from 'codemirror'
// JS mode
import 'codemirror/mode/javascript/javascript'
// Addons, extentions
import 'codemirror/keymap/vim'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/runmode/runmode'

export const SCRUBBER_VAR = '$scrub$'

const UNARY_AFTER = [ '=', '(', '?', ':', '[' ]

interface ScrubberOptions {
  scrubber: Scrubber
}

interface CMEditor extends CodeMirror.Editor {
  options: ScrubberOptions
}

interface RunModeCallback {
  ( text: string, klass: string ): void
}

export interface LiteralScrub {
  value: number
  text: string
  ch: number
  line: number
}

// FIXME: Replace all 'scrubber' options with 'lucid'.
interface LucidEditor {
  scrubber: Scrubber
  lock?: string
  noscrub?: boolean
  blockId?: string // to detect change of block selection
  cursorMarkCleared?: boolean
  nosave?: boolean
}

interface ScrubberEditor {
  lock?: string
  noscrub?: boolean
  blockId?: string // to detect change of block selection
  cursorMarkCleared?: boolean
  nosave?: boolean
}

export interface Scrubber {
  literals?: LiteralScrub[]
  values?: number[]
  // Call init on block if value changes
  init?: any
  // Editor options to properly handle scrubbing.
  // and focus
  editor?: ScrubberEditor
}

const floatRe = /\./

const scrubdown = ( e: MouseEvent, i: number, cm: CMEditor ) => {
  // start click
  const scrubber = cm.options.scrubber
  const sedit = scrubber.editor
  if ( !sedit.lock ) {
    sedit.lock = 'scrub'
  }
  e.preventDefault ()
  const el = <HTMLElement>e.target
  const sx = e.clientX
  const sy = e.clientY
  // original value
  const sv = scrubber.values [ i ]
  // original literal (until we save on mouseup)
  const lit = scrubber.literals [ i ]
  // original line
  const doc = cm.getDoc ()
  const oline: string = doc.getLine ( lit.line )
  const before = oline.substr ( 0, lit.ch )
  const after = oline.substr ( lit.ch + lit.text.length )
  el.classList.add ( 'scrubbing' )
  const sfloat = floatRe.test ( el.innerHTML )
  let v: string
  // move callback on global window (like drag)
  const mousemove = ( e: MouseEvent ) => {
    e.preventDefault ()
    const isfloat = ( sfloat && !e.shiftKey ) || e.altKey
    // scale to approx -0.5, 0.5 in comfortable drag zone
    const dx = ( e.clientX - sx ) / 384   // some magic numbers...
    const dy = - ( e.clientY - sy ) / 200
    if ( isfloat ) {
      // FLOAT
      // get dim as approx 10^2 .... 10^-2 .... 10^2
      const dimx = Math.pow ( 10, Math.abs ( 6 * dx ) - 2 )
      const dimy = Math.pow ( 10, Math.abs ( 6 * dy ) - 2 )
      const dist = ( dx > 0 ? 1 : -1 ) * dimx
                 + ( dy > 0 ? 1 : -1 ) * dimy
      v = (sv + dist).toFixed ( 4 )
      scrubber.values [ i ] = parseFloat ( v ) // ensures str === live value
    }
    else {
      // INT
      // get dim as approx 10^2 .... 1 .... 10^2
      const dimx = Math.pow ( 10, Math.abs ( 2 * dx ) )
      const dimy = Math.pow ( 10, Math.abs ( 2 * dy ) )
      const dist = ( dx > 0 ? 1 : -1 ) * dimx
                 + ( dy > 0 ? 1 : -1 ) * dimy
      v = (sv + dist).toFixed ( 0 )
      scrubber.values [ i ] = parseInt ( v )
    }

    el.textContent = v

    try {
      scrubber.init ()
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
    // end of interaction, incoming sources from save op
    const nline = before + v + after
    const f = { line: lit.line, ch: 0 }
    const t = { line: lit.line, ch: oline.length }
    if ( scrubber.editor.lock === 'scrub' ) {
      scrubber.editor.lock = null
    }
    doc.replaceRange ( nline, f, t )
  }

  document.body.style.cursor = 'move'
  window.addEventListener ( 'mousemove', mousemove )
  window.addEventListener ( 'mouseup', mouseup )
}

export module CodeHelper {

  const replaceWithScrubber =
  ( literals: number[]
  , value
  ): Object => {
    const idx = literals.push ( value ) - 1
    return `${SCRUBBER_VAR}[${idx}]`
  }

  export const scrubParse =
  ( source: string
  , literals: LiteralScrub[]
  , mode: string = 'javascript'
  ): string => {
    const output = []
    let line = 0
    let ch = 0
    const CM = <any>CodeMirror // this is annoying
    CM.runMode ( source, mode, ( text, klass ) => {
      if ( text === '\n' ) {
        ++line
        ch = 0
        output.push ( text )
      }
      else {
        if ( klass === 'number' ) {
          // const foo = 4 - 5
          const idx = literals.push ( { text, line, ch, value: parseFloat ( text ) } ) - 1
          let p = output.length - 1
          let uch = ''
          let unarypos = null
          let getMinus = true

          while ( true ) {
            const op = output [ p ]
            if ( op[ 0 ] === ' ' ) {
              // whitespace
              if ( getMinus ) {
                uch = op + uch
              }

              --p
            }
            else if ( getMinus ) {
              if ( op === '-' ) {
                getMinus = false
                unarypos = p
                uch = op + uch
                --p
              }
              else {
                // not unary minus
                break
              }
            }
            else if ( UNARY_AFTER.indexOf ( op ) >= 0 ) {
              break
            }
            else {
              unarypos = null
              break
            }
          }

          const s = `${SCRUBBER_VAR}[${idx}]`
          if ( unarypos ) {
            // unary minus
            while ( output.length > unarypos ) {
              output.pop ()
            }
            output.push ( s )
            // make unary
            const l = literals [ idx ]
            l.value = - l.value
            l.text = uch + l.text
            l.ch -= uch.length
          }
          else {
            output.push ( s )
          }
        }
        else {
          output.push ( text )
        }
        ch += text.length
      }
    })
    return output.join ( '' )
  }

  export const transpile =
  ( source: string
  , scrubber?: Scrubber
  ) => {
    let src = source
    let literals
    if ( scrubber ) {
      scrubber.literals = []
      src = scrubParse ( source, scrubber.literals )
      scrubber.values = scrubber.literals.map ( l => l.value )
      const { code, errors } = LanguageService.compile ( src, false )
      return code
    }
    else {
      const { code, errors } = LanguageService.compile ( src )
      if ( !code ) {
        throw errors
      }
      return code
    }
  }

  let updating = false

  // Called by playback when the content is compiled.
  export const scrubMark =
  ( cm: CMEditor
  ) => {
    const scrubber = cm.options.scrubber

    if ( updating || scrubber.editor.noscrub ) {
      // update could be called while we update the tree. Avoid.
      return
    }
    updating = true
    // clear previous marks
    const doc = cm.getDoc ()
    const marks = doc.getAllMarks ()
    for ( const m of marks ) {
      m.clear ()
    }
    scrubber.editor.cursorMarkCleared = false

    const literals = scrubber.literals
    if ( !literals ) {
      updating = false
      return
    }

    for ( let i = 0; i < literals.length; ++i ) {
      const l = literals [ i ]
      const span = document.createElement ( 'span' )
      span.textContent = l.text
      const start = { line: l.line, ch: l.ch }
      const end = { line: l.line, ch: l.ch + l.text.length }
      span.classList.add ( 'cm-number' )
      span.classList.add ( 'scrub' )
      const mark = doc.markText
      ( start
      , end
      , { handleMouseEvents: true
        , replacedWith: span
        , atomic: false
        }
      )
      CodeMirror.on ( mark, 'beforeCursorEnter', () => {
        // mark around cursor are a mess
        scrubber.editor.cursorMarkCleared = true
        mark.clear ()
      })

      span.addEventListener
      ( 'mousedown'
      , ( e ) => {
          scrubdown ( e, i, cm )
        }
      )
    }

    updating = false
  }

  export const scrubSetup = // called on new CodeMirror and setOptions
  ( cm, scrubber, old) => {
    if ( scrubber ) {
      cm.options.scrubber = scrubber
      scrubMark ( cm )
    }
  }

  export const sourceChanged =
  ( cm: CMEditor
  , block: BlockType
  ) => {
    const sedit = cm.options.scrubber.editor
    if ( sedit.lock && sedit.blockId === block.id ) {
      return
    }
    else {
      // prevent save while we update the source
      sedit.nosave = true
        sedit.blockId = block.id
        cm.setValue ( block.source || '' )
        // clear marks until we get updated ones
        const doc = cm.getDoc ()
        const marks = doc.getAllMarks ()
        for ( const m of marks ) {
          m.clear ()
        }
      sedit.nosave = false
    }
  }

  let defaultEditor
  export const getEditor =
  () => {
    return defaultEditor
  }

  const NoScrubToggle =
  ( cm: CMEditor ) => {
    const sedit = cm.options.scrubber.editor
    sedit.noscrub = ! sedit.noscrub
    if ( sedit.noscrub ) {
      // clear marks
      const doc = cm.getDoc ()
      const marks = doc.getAllMarks ()
      for ( const m of marks ) {
        m.clear ()
      }
    }
    else {
      scrubMark ( cm )
    }
  }

  const isLiteral = /[0-9\.]/

  export const editor =
  ( elm: HTMLElement
  , source: string = ''
  , save: any = null
  ): any => {

    // We copy in here the currently loaded block's scrubber so that
    // we can access it from the editor.
    const scrubber: Scrubber = { values: [], init () {}, literals: [], editor: {} }

    const opts =
    { value: source
    , indentUnit: 2
    , lineWrapping: true
    , theme: 'bespin'
    , mode: 'javascript'
    , keyMap: 'vim' // FIXME: should come from user prefs
    , gutters: [ 'lucy-gutter' ]
    , extraKeys:
      { Tab: 'indentMore'
      , [ 'Shift-Tab' ]: 'indentLess'
      , [ 'Alt-S' ]: NoScrubToggle
      }
    , smartIndent: false
    }

    // addons
    opts [ 'scrollbarStyle' ] = 'overlay'
    opts [ 'scrubber' ] = scrubber

    const cm = CodeMirror ( elm, opts )
    defaultEditor = cm

    cm.on ( 'focus', () => {
      scrubber.editor.lock = 'focus'// block.id
    })

    cm.on ( 'blur', () => {
      scrubber.editor.lock = null
    })

    cm.on ( 'cursorActivity', () => {
      if ( scrubber.editor.cursorMarkCleared ) {
        // Check cursor distance to literal number
        const doc = cm.getDoc ()
        const loc = doc.getCursor ()
        const before = doc.getRange ( { line: loc.line, ch: loc.ch - 1 }, loc )
        const after = doc.getRange ( loc, { line: loc.line, ch: loc.ch + 1 } )
        if ( isLiteral.test ( before ) || isLiteral.test ( after ) ) {
          // ignore
        }
        else {
          // mark and clear
          scrubMark ( <CMEditor>cm )
        }
      }
    })

    if ( save ) {
      cm.on ( 'changes' , () => {
        // Do not trigger 'save' while we are updating the
        // source through setValue.
        if ( !scrubber.editor.nosave ) {
          save ()
        }
      })
    }

    return cm
  }
}

CodeMirror.defineOption
( 'scrubber', {}, CodeHelper.scrubSetup )
