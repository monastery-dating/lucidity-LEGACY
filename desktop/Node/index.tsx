import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { UINodeType, UISlotType } from '../../modules/Graph/types'

const makeSlot = ( slot: UISlotType, clbk ) => {
  const flags = slot.flags
  const { x, y } = slot.pos
  const klass = Object.assign ( {}, flags, { slot: true })
  const transform = `translate(${x}, ${y})`
  if ( flags.free ) {
    console.log ( transform )
    return <g transform={ transform }>
        <path d={ slot.plus } class='plus'/>
        <path d={ slot.click }
          on-click={ () => clbk ( slot.idx ) } class='click' />
      </g>
  }
  else if ( !flags.detached ){
    // do not draw slot
    return ''
  }
  else {
    return <g transform={ transform }>
        <path d={ slot.path } class={ klass }/>
      </g>
  }
}

export const Node = Component
( { // layout ...
  }
, ( { state, props, signals }: ContextType ) => {
    const uinode: UINodeType = props.uinode
    const x = uinode.pos.x
    const y = uinode.pos.y
    const transform = `translate(${x},${y})`
    const klass = { [uinode.className]: true, ghost:uinode.isGhost }
    const clbk = ( pos ) => {
      signals.graph.add ( { pos, parentId: uinode.id } )
    }

    return <g transform={ transform }>
        <path d={ uinode.path } class={ klass }></path>
        <text x={ uinode.size.tx } y={ uinode.size.ty }>
          { uinode.name }
        </text>
        { uinode.slots.map ( ( s ) => makeSlot ( s, clbk ) ) }
      </g>
  }
)