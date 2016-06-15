import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { CodeEditor } from '../CodeEditor'
import { Controls } from '../Controls'
import { editable, openModal, pane } from '../../modules/Factory'
// import { Graph } from '../Graph'

const BlockName = editable ( [ 'block', 'name' ] )

export const Block = Component
( { block: [ 'block' ]
  , select: [ '$block' ]
  , tab: [ '$blocktab' ]
  , controls: [ '$controls' ]
    // update ui on block name edit
  , editing: BlockName.path
  }
, ( { state, signals }: ContextType ) => {
    const klass = { Block: true, hidden: !state.block }
    const tab = state.tab || 'code'
    const codetab = { visibility: tab === 'code' ? 'inherit' : 'hidden' }
    const controlstab = { visibility: tab === 'controls' ? 'inherit' : 'hidden' }
    const usetab = ( v ) => {
      signals.block.tab ( { value: v } )
    }

    return <div class={ klass }>
        <div class='bar tabs'>
          <div class='stretch'>
            <div class='fa fa-cube'
              on-click={ () => usetab ( 'code' ) }></div>
            <BlockName class='name'/>
          </div>

          <div class={{ tab: true, sel: tab === 'code' }}>
            <div class='fa fa-file-text'></div>
            index.js
          </div>
          <div class={{ tab: true, sel: tab === 'code' }}>
            <div class='fa fa-file-text'></div>
            frag.glsl
          </div>
          <div class={{ tab: true, sel: tab === 'code' }}>
            <div class='fa fa-sliders'
              on-click={ () => usetab ( 'controls' ) }></div>
            Control
          </div>
        </div>
        <CodeEditor key='CodeEditor' block={ state.block || {} } style={ codetab }/>
        <Controls key='Controls' style={ controlstab }/>
      </div>
  }
)
