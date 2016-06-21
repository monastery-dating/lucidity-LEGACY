import './style.scss'
import { BlockType } from '../../modules/Block'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { CodeEditor } from '../CodeEditor'
import { Controls } from '../Controls'
import { editable, openModal, pane } from '../../modules/Factory'
// import { Graph } from '../Graph'

const BlockName = editable ( [ 'block', 'name' ] )

const ExtraSourcesTab = ( block: BlockType, tab, usetab ): any => {
  const sources = block.sources
  if ( sources ) {
    return Object.keys ( sources ).sort ().map
    ( name => (
        <div class={{ tab: true, sel: tab === name }}
          on-click={ () => usetab ( name ) }>
          <div class='fa fa-file-text'></div>
          { name }
        </div>
      )
    )
  }
  return ''
}

const ControlsTab = ( controls, tab, usetab ) => {
  if ( controls ) {
    return <div class={{ tab: true, sel: tab === 'controls' }}
          on-click={ () => usetab ( 'controls' ) }>
        <div class='fa fa-sliders'></div>
        Control
      </div>
  }
  else {
    return ''
  }
}

export const Block = Component
( { tab: [ '$blocktab' ]
    // for controls ?
  , controls: [ '$controls' ]
    // for block name ?
  , block: [ 'block' ]
    // update ui on block name edit
  , editing: BlockName.path
  }
, ( { state, signals }: ContextType ) => {
    const klass = { Block: true, hidden: !state.block }
    const block = state.block || {}
    const tab = state.tab || 'main.ts'
    const codetab = { visibility: tab !== 'controls' ? 'inherit' : 'hidden' }
    const controlstab = { visibility: tab === 'controls' ? 'inherit' : 'hidden' }
    const usetab = ( v ) => {
      signals.block.tab ( { value: v } )
    }

    return <div class={ klass }>
        <div class='bar tabs'>
          <div class='stretch'>
            <div class='fa fa-cube'></div>
            <BlockName class='name'/>
          </div>

          <div class={{ tab: true, sel: tab === 'main.ts' }}
              on-click={ () => usetab ( 'main.ts' ) }>
            <div class='fa fa-file-text'></div>
            main.ts
          </div>
          { ExtraSourcesTab ( block, tab, usetab ) }
          { ControlsTab ( state.controls, tab, usetab ) }
        </div>
        <CodeEditor key='CodeEditor' style={ codetab } tab={ tab }/>
        <Controls key='Controls' style={ controlstab }/>
      </div>
  }
)
