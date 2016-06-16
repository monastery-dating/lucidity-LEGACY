import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { CodeHelper } from '../../modules/Code/helper/CodeHelper'

// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/dialog/dialog.css'

let editor = null
let source

export const CodeEditor = Component
( {}
, ( { props, signals }: ContextType ) => {
    const block = props.block
    const save = () => {
      // Save callback
      console.log ( 'SAVE FROM CODEEDITOR' )
      signals.block.source
      ( { value: editor.getValue () } )
    }

    const create = ( _, { elm } ) => {
      if ( editor === null ) {
        editor = false
        setTimeout
        ( () => {
            editor = CodeHelper.editor
            ( elm
            , block.source
            , save
            )
          }
        , 100
        )
      }
    }

    if ( source !== block.source && editor ) {
      source = block.source
      CodeHelper.sourceChanged ( editor, source || '' )
    }

    return <div class='CodeEditor' style={ props.style }>
        <div class='codeholder' hook-create={ create }></div>
      </div>
  }
)
