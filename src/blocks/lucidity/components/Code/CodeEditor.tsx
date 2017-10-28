import { Signal, State } from 'app'
import * as React from 'react'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'

import { sourceChanged, makeEditor, saveSource } from '../../lib/Code/helper/CodeHelper'
// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/dialog/dialog.css'

interface Props {
  code: string
  lang: string
}

interface EProps {
  className?: string
  focus?: boolean
  path: string
  tab?: string
  onSave: ( code: string ) => void
  onBlur?: () => void
}

const Wrapper = styled.div`
margin: 2rem;

.scrubbing {
  background: yellow;
}

.cm-number {
  border: 1px dashed rgba(0,0,0,0);
  &.scrub {
    border: 1px dashed yellow;
    border-radius: 4px;
    cursor: move;
  }
}

.CodeMirror-overlayscroll-horizontal div,
.CodeMirror-overlayscroll-vertical div {
  background: #333;
}

.CodeMirror {
  padding: 10px;
  min-height: 1rem;
  height: auto;
}

.CodeMirror-code {
  font-size: 1rem;
}

.CodeMirror-linewidget {
  background: #353030;
  border-top: 1px dashed #899266;
  color: #959663;
  left: -1px;
  margin-top: 4px;
  padding: 4px;
  padding-left: 0px;
  width: 460px;
}
`

export const CodeEditor = connect < Props, EProps > (
  { code: state`${ props`path` }.code`
  , lang: state`${ props`path` }.lang`
  }
, class CodeDisplay extends React.Component < Props & EProps > {
    private cm: any

    create ( elm : any  ) {
      const { props } = this
      if ( this.cm === undefined ) {
        console.log(elm)
        const onSave = ( filename: string, source: string ) => {
          props.onSave ( source )
        }

        const typecheck = ( filename: string, source: string ) => {
          // typecheck ( { filename, source } )
        }

        this.cm = false
        setTimeout
        ( () => {
            this.cm = makeEditor
            ( elm
            , props.code || ''
            , props.lang || 'ts'
            , { onSave
              , onBlur: props.onBlur
              , typecheck
              }
            , { autofocus: this.props.focus }
            )
            sourceChanged
            ( this.cm
            , props.lang
            , props.code
            , {} as any
            )
            // FIXME: focus...
          }
        , 100
        )
      }
    }

    render () {
      console.log ( 'RENDER XXX' )
      const { props } = this

      if ( this.cm ) {
        /*
        const errors = this.props.errors
        this.cm.operation
        ( () => {
            const doc = cm.getDoc ()
            for ( const v of ederror ) {
              doc.removeLineWidget ( v )
            }
            ederror.length = 0
            showErrors ( errors )
          }
        )
        */
      }

      let source = props.code
      /*
      if ( tab !== 'main.ts' && tab !== 'controls' ) {
        const sources = block.sources || {}
        source = sources [ tab ]
      }
        */

      if ( this.cm /* && tab !== 'controls' */ ) {
        sourceChanged ( this.cm, this.props.lang, source, {} as any )
      }

      return (
        <Wrapper
          className={ this.props.className }
          onClick={ e => e.stopPropagation () } 
          >
          <div className='codeholder' ref={ el => this.create ( el ) }></div>
        </Wrapper>
      )
    }
  }
)
