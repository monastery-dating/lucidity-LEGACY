import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { CodeEditor } from '../CodeEditor'
import { editable, openModal, pane } from '../../modules/Factory'
// import { Graph } from '../Graph'

const BlockName = editable ( [ 'block', 'name' ] )

export const Block = Component
( { block: [ 'block' ]
  , select: [ '$block' ]
    // update ui on block name edit
  , editing: BlockName.path
  }
, ( { state, signals }: ContextType ) => {
    const klass = { Block: true, hidden: !state.block }

    return <div class={ klass }>
        <div class='bar tabs'>
          <div class='stretch'>
            <div class='fa fa-cube'></div>
            <BlockName class='name'/>
          </div>

          <div class='tab sel'>
            <div class='fa fa-file-text'></div>
            index.js
          </div>
          <div class='tab'>
            <div class='fa fa-file-text'></div>
            frag.glsl
          </div>
          <div class='tab'>
            <div class='fa fa-sliders'></div>
            Control
          </div>
        </div>
        <CodeEditor key='CodeEditor' block={ state.block || {} }/>
      </div>
  }
)
