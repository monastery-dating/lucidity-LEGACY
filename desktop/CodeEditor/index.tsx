import './style.scss'
import { BlockType } from '../../modules/Block'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { sourceChanged, makeEditor } from '../../modules/Code/helper/CodeHelper'
import { CompilerError } from '../../modules/Code/helper/types'

// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/dialog/dialog.css'
import { debounce } from '../../modules/Utils'
let cm = null
const ederror = []

let serrors: CompilerError[]

const debounceErrors = debounce ( 1000 )
const doShowErrors = () => {
  if ( serrors ) {
    const doc = cm.getDoc ()
    for ( const v of serrors ) {
      const msg = document.createElement ( 'div' )
      msg.textContent = v.message
      msg.className = 'error'
      ederror.push
      ( doc.addLineWidget
        ( v.line, msg, { coverGutter: false, noHScroll: true } )
      )
    }
    serrors = null
  }
}

const showErrors = ( errors ) => {
  serrors = errors
  // debounce
  debounceErrors ( { output: doShowErrors } )
}

let block: BlockType = null

export const CodeEditor = Component
( { block: [ 'block' ]
  , select: [ '$block' ]
  , errors: [ '$editor', 'errors' ]
  }
, ( { props, state, signals }: ContextType ) => {
    block = state.block || {}
    const tab = props.tab

    const save = ( filename: string, source: string ) => {
      if ( filename === 'main.ts' ) {
        signals.block.source
        ( { source } )
      }
      else {
        if ( block && block.sources ) {
          const src = block.sources [ filename ]
          if ( typeof src === 'string' ) {
            const sources = Object.assign ( {}, block.sources )
            sources [ filename ] = source
            signals.block.sources
            ( { sources } )
          }
          else {
            console.log ( `Invalid filename '${filename}'. Cannot save.` )
          }
        }
        else {
          console.log ( `No extra sources. Cannot save.` )
        }
      }
    }

    if ( cm ) {
      const errors = state.errors
      cm.operation
      ( () => {
          const doc = cm.getDoc ()
          for ( const v of ederror ) {
            doc.removeLineWidget ( v )
          }
          ederror.length = 0
          showErrors ( errors )
        }
      )
    }

    const create = ( _, { elm } ) => {
      if ( cm === null ) {
        cm = false
        setTimeout
        ( () => {
            cm = makeEditor
            ( elm
            , block.source || ''
            , save
            )
          }
        , 100
        )
      }
    }

    let source = block.source
    if ( tab !== 'main.ts' && tab !== 'controls' ) {
      const sources = block.sources || {}
      source = sources [ tab ]
    }

    if ( cm && tab !== 'controls' ) {
      sourceChanged ( cm, tab, source, block.id )
    }

    return <div class='CodeEditor' style={ props.style }>
        <div class='codeholder' hook-create={ create }></div>
      </div>
  }
)
