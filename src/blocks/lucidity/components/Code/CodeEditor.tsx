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
  ablock: any
  select: any
  errors: any
  code: string
}

interface EProps {
  path: string
  tab?: string
}

const Wrapper = styled.div`
margin: 2rem;

.scrubbing {
  background: yellow;
}

.cm-number {
  border: 1px dashed rgba(0,0,0,0);
  &.scrub {
    cursor: move;
    border: 1px dashed yellow;
    border-radius: 4px;
  }
}

.CodeMirror-overlayscroll-horizontal div,
.CodeMirror-overlayscroll-vertical div {
  background: #333;
}

.CodeMirror {
  padding: 0;
}

.CodeMirror-linewidget {
  margin-top: 4px;
  left: -1px;
  padding-left: 0px;
  width: 460px;
  background: #353030;
  color: #959663;
  padding: 4px;
  border-top: 1px dashed #899266;
}
`

export const CodeEditor = connect < Props, EProps > (
  { ablock: state`block`
  , code: state`${ props`path` }.text`
  , select: state`$block`
  , errors: state`$editor.errors`
  }
, class CodeDisplay extends React.Component < Props & EProps > {
    private cm: any

    create ( elm : any  ) {
      const block = this.props.ablock || {}
      if ( this.cm === undefined ) {
        console.log ( elm )
        const save = ( filename: string, source: string ) => {
          // saveSource ( { filename, source } )
        }

        const typecheck = ( filename: string, source: string ) => {
          // typecheck ( { filename, source } )
        }

        this.cm = false
        setTimeout
        ( () => {
            this.cm = makeEditor
            ( elm
            , this.props.code || ''
            , save
            , typecheck
            )
          }
        , 100
        )
      }
    }

    render () {
      console.log ( 'RENDER XXX' )
      const { props } = this
      const block = props.ablock || {}

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
        sourceChanged ( this.cm, 'main.ts' /* tab */, source, block )
      }

      return <Wrapper className='CodeEditor'>
          <div className='codeholder' ref={ el => this.create ( el ) }></div>
        </Wrapper>
    }
  }
)
