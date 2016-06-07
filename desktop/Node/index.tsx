import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { NodeType, UINodeType, UISlotType } from '../../modules/Graph/types'
import { DragDropHelper } from '../../modules/DragDrop'
import { ProjectType } from '../../modules/Project'
import { SceneType } from '../../modules/Scene'

const makeSlot = ( slot: UISlotType, datainfo, clbk ) => {
  const flags = slot.flags
  const { x, y } = slot.pos
  const klass = Object.assign ( {}, flags, { slot: true })
  const slotinfo = `${datainfo}-${slot.idx}`
  const transform = `translate(${x}, ${y})`
  if ( flags.free ) {
    return <g transform={ transform }>
        <path d={ slot.plus } class='plus'/>
        <path d={ slot.click } data-drop={ slotinfo }
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
( { blockId: [ 'user', 'blockId' ]
  , move: [ '$dragdrop', 'move' ] // react to drag op
  }
, ( { state, props, signals }: ContextType ) => {
    const uinode: UINodeType = props.uinode
    const node: NodeType = props.node
    const ownerType = props.ownerType
    const x = uinode.pos.x
    const y = uinode.pos.y
    const transform = `translate(${x},${y})`
    let datainfo = `${ownerType}-${uinode.id}`
    if ( uinode.isghost ) {
      if ( uinode.isghost === node.id ) {
        // hovering on main element: do nothing
        datainfo = `${ownerType}-drop`
      }
      else {
        // force change of drop layout
        datainfo = ``
      }
    }

    const klass = { sel: node.blockId === props.blockId
                  , [ uinode.className ]: true
                  , ghost: uinode.isghost
                  }

    const { mousedown, mousemove, mouseup } = DragDropHelper.drag
    ( signals
    , ( nodePos ) => {
        // start drag
        signals.$dragdrop.drag
        ( { drag:
            { ownerType
            , nodeId: node.id
            , nodePos
            }
          } )
      }
    , ( e ) => {
        // normal click
        signals.block.select ( { id: node.blockId, ownerType } )
      }
    )

    const slotclick = ( pos ) => {
      signals.block.add
      ( { pos
        , parentId: uinode.id
        , ownerType
        }
      )
    }

    return <g transform={ transform }>
        <path d={ uinode.path } class={ klass }
          data-drop={ datainfo }
          on-mousedown={ mousedown }
          on-mouseup={ mouseup }
          on-mousemove={ mousemove }
          ></path>
        <text x={ uinode.size.tx } y={ uinode.size.ty }>
          { uinode.name }
        </text>
        { uinode.slots.map
          ( ( s ) => makeSlot ( s, datainfo, slotclick ) )
        }
      </g>
  }
)
