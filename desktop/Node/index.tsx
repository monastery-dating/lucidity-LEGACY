import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { UINodeType, UISlotType } from '../../modules/Graph/types'
import { ProjectType } from '../../modules/Project'
import { SceneType } from '../../modules/Scene'

const makeSlot = ( slot: UISlotType, clbk ) => {
  const flags = slot.flags
  const { x, y } = slot.pos
  const klass = Object.assign ( {}, flags, { slot: true })
  const transform = `translate(${x}, ${y})`
  if ( flags.free ) {
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
( { block: [ 'block' ] // selected block
  }
, ( { state, props, signals }: ContextType ) => {
    const uinode: UINodeType = props.uinode
    const ownerType = props.ownerType
    const x = uinode.pos.x
    const y = uinode.pos.y
    const transform = `translate(${x},${y})`
    const klass = { sel: false
                  , [ uinode.className ]: true
                  , ghost: uinode.isGhost
                  }

    if ( state.block ) {
      klass.sel = state.block._id === uinode.blockId
    }


    const slotclick = ( pos ) => {
      signals.block.add
      ( { pos
        , parentId: uinode.id
        , ownerType
        }
      )
    }

    const click = () => {
      signals.block.select ( { _id: uinode.blockId } )
    }

    return <g transform={ transform }>
        <path d={ uinode.path } class={ klass }
          on-click={ click }></path>
        <text x={ uinode.size.tx } y={ uinode.size.ty }>
          { uinode.name }
        </text>
        { uinode.slots.map
          ( ( s ) => makeSlot ( s, slotclick ) )
        }
      </g>
  }
)
