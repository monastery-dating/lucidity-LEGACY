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

const FOOCODE =
"// This is a comment\n\nexport const render =\n( a, b ) => {\n  // ... do something\n  return { text: '' }\n}"

export const Editor = Component
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
    }

    return <div class='Editor'>
        <div hook-create={ create }></div>
      </div>
  }
)
