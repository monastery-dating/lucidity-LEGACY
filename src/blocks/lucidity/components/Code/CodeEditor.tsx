import { Signal, State } from 'app'
import * as React from 'react'
import { connect, Component, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { CustomTagProps } from 'editor'
import { styled } from 'styled'

import { sourceChanged, makeEditor, saveSource } from '../../lib/Code/helper/CodeHelper'
// CodeMirror CSS
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/bespin.css'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/dialog/dialog.css'

interface Props {
  source: string
  lang: string
}

interface EProps extends CustomTagProps {
  className?: string
  focus?: boolean
  tab?: string
  onSave: ( source: string ) => void
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
  { source: state`${ props`path` }.source`
  , lang: state`${ props`path` }.lang`
  }
, class CodeDisplay extends Component < Props & EProps > {
    private cm: any

    create ( el : any  ) {
      const { props } = this
      if ( this.cm === undefined ) {
        const onSave = ( filename: string, source: string ) => {
          this.props.onSave ( source )
        }

        const typecheck = ( filename: string, source: string ) => {
          // this.props.typecheck ( { filename, source } )
        }

        const id = props.path.split ( '.' ).slice ( -1 ) [ 0 ]
        this.cm = false
        setTimeout
        ( () => {
            this.cm = makeEditor
            ( el
            , props.source || ''
            , props.lang || 'ts'
            , { onSave
              , onBlur: props.onBlur
              , typecheck
              }
            , { autofocus: props.focus }
            )
            sourceChanged
            ( this.cm
            , props.lang
            , props.source
            , { id } as any
            )
            // FIXME: focus...
          }
        , 100
        )
      }
    }

    render () {
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

      if ( this.cm ) {
        const id = props.path.split ( '.' ).slice ( -1 ) [ 0 ]
        sourceChanged ( this.cm, props.lang, props.source, { id } as any )
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
