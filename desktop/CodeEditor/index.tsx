import './style.scss'
import { BlockType } from '../../modules/Block'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { CodeHelper } from '../../modules/Code/helper/CodeHelper'

// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/dialog/dialog.css'
import { debounce } from '../../modules/Block/actions/debounce'
let cm = null
let source
const ederror = []

let serrors

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
        ( v.loc.line, msg, { coverGutter: false, noHScroll: true } )
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

export const CodeEditor = Component
( { block: [ 'block' ]
  , select: [ '$block' ]
  , errors: [ '$editor', 'errors' ]
  }
, ( { props, state, signals }: ContextType ) => {
    const block: BlockType = state.block || {}
    
    const save = () => {
      source = cm.getValue ()
      signals.block.source
      ( { value: source } )
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
            cm = CodeHelper.editor
            ( elm
            , block.source || ''
            , save
            )
          }
        , 100
        )
      }
    }

    if ( source !== block.source && cm ) {
      source = block.source
      CodeHelper.sourceChanged ( cm, block )
    }

    return <div class='CodeEditor' style={ props.style }>
        <div class='codeholder' hook-create={ create }></div>
      </div>
  }
)
