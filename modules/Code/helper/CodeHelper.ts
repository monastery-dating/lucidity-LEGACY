import { BlockType } from '../../Block'

import { CodeMirror } from './CodeMirror'

import { TranspileCallback, ScrubCode } from './types'

const worker = new Worker ( 'build/codeWorker.js' )

interface Operation {
  id: string
  source: string
  callback: TranspileCallback
}

interface WorkerOperations {
  [ key: string ]: Operation
}

const WORKER_OPS: WorkerOperations = {}
const PENDING_OPS: string[] = []
let opid: number = 0

worker.addEventListener ( 'message', ( e ) => {
  const { id, data } = e.data
  const op = WORKER_OPS [ id ]
  delete WORKER_OPS [ id ]

  if ( !op ) {
    console.log ( `ERROR: Wrong worker response (operation ${id} not found).`)
  }
  else {
    // e.data === TranspileCallbackArgs
    op.callback ( data )
  }
})

let runWork =
( source, callback ) => {
  ++opid
  const id = opid.toString ()
  WORKER_OPS [ id ] = { id, source, callback }
  PENDING_OPS.push ( id )
  // Without worker
  // callback ( compile ( source ) )
}

const ready: any = () => {
  console.log ( 'WORKER READY' )
  runWork =
  ( source, callback ) => {
    ++opid
    const id = opid.toString ()
    WORKER_OPS [ id ] = { id, source, callback }
    worker.postMessage ( { id, source } )
    // Without worker
    // callback ( compile ( source ) )
  }
  for ( const v of PENDING_OPS ) {
    const { id, source } = WORKER_OPS [ v ]
    worker.postMessage ( { id, source })
  }
  PENDING_OPS.length = 0
}

WORKER_OPS [ 'ready' ] = ( { id: 'ready', callback: ready, source: '' } )

// Without worker
// import { compile } from './codeWorker'


interface CMOptions {
  lucidity: EditorLucidityOptions
}

interface CMEditor extends CodeMirror.Editor {
  options: CMOptions
}

interface RunModeCallback {
  ( text: string, klass: string ): void
}

interface EditorLucidityOptions {
  scrubber: Scrubber
  lock?: string
  noscrub?: boolean
  blockId?: string // to detect change of block selection
  cursorMarkCleared?: boolean
  nosave?: boolean
}

export interface Scrubber extends ScrubCode {
  // Call init on block if value changes
  init?: any
}

const floatRe = /\./

const scrubdown = ( e: MouseEvent, i: number, cm: CMEditor ) => {
  // start click
  const ledit = cm.options.lucidity
  const scrubber = ledit.scrubber
  if ( !ledit.lock ) {
    ledit.lock = 'scrub'
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
    if ( ledit.lock === 'scrub' ) {
      ledit.lock = null
    }
    doc.replaceRange ( nline, f, t )
  }

  document.body.style.cursor = 'move'
  window.addEventListener ( 'mousemove', mousemove )
  window.addEventListener ( 'mouseup', mouseup )
}

export const compileCode =
( source: string
, done: TranspileCallback
) => {
  // Call 'done' with TranspileCallbackArgs when compilation is finished
  runWork ( source, done )
}

let updating = false

// Called by playback when the content is compiled.
export const scrubMark =
( cm: CMEditor
) => {
  const ledit = cm.options.lucidity
  const scrubber = ledit.scrubber

  if ( updating || ledit.noscrub ) {
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
  ledit.cursorMarkCleared = false

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
      ledit.cursorMarkCleared = true
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

const scrubSetup =
// called on new CodeMirror and setOptions
( cm: CMEditor, opts, old) => {
  if ( opts ) {
    cm.options.lucidity = opts
    scrubMark ( cm )
  }
}

export const sourceChanged =
( cm: CMEditor
, block: BlockType
) => {
  const ledit = cm.options.lucidity
  if ( ledit.lock && ledit.blockId === block.id ) {
    return
  }
  else {
    // prevent save while we update the source
    ledit.nosave = true
      ledit.blockId = block.id
      cm.setValue ( block.source || '' )
      // clear marks until we get updated ones
      const doc = cm.getDoc ()
      const marks = doc.getAllMarks ()
      for ( const m of marks ) {
        m.clear ()
      }
    ledit.nosave = false
  }
}

let defaultEditor
export const getEditor =
() => {
  return defaultEditor
}

const NoScrubToggle =
( cm: CMEditor ) => {
  const ledit = cm.options.lucidity
  ledit.noscrub = ! ledit.noscrub
  if ( ledit.noscrub ) {
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

export const makeEditor =
( elm: HTMLElement
, source: string = ''
, save: any = null
): any => {

  // We copy in here the currently loaded block's scrubber so that
  // we can access it from the editor.
  const scrubber: Scrubber =
  { js: '', values: [], init () {}, literals: [] }

  const ledit: EditorLucidityOptions = { scrubber }

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
  opts [ 'lucidity' ] = ledit

  const cm = CodeMirror ( elm, opts )
  defaultEditor = cm

  cm.on ( 'focus', () => {
    ledit.lock = 'focus'// block.id
  })

  cm.on ( 'blur', () => {
    ledit.lock = null
  })

  cm.on ( 'cursorActivity', () => {
    if ( ledit.cursorMarkCleared ) {
      // Check cursor distance to literal number
      const doc = cm.getDoc ()
      const loc = doc.getCursor ()
      const before = doc.getRange ( { line: loc.line, ch: loc.ch - 1 }, loc )
      const after = doc.getRange ( loc, { line: loc.line, ch: loc.ch + 1 } )
      console.log ( `before '${before}' after '${after}'`)
      if ( isLiteral.test ( before ) || isLiteral.test ( after ) ) {
        // ignore
      }
      else {
        // mark back
        scrubMark ( <CMEditor>cm )
      }
    }
  })

  if ( save ) {
    cm.on ( 'changes' , () => {
      // Do not trigger 'save' while we are updating the
      // source through setValue.
      if ( !ledit.nosave ) {
        save ()
      }
    })
  }

  return cm
}

CodeMirror.defineOption
( 'lucidity', {}, scrubSetup )
