import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { NodeType, UINodeType, UISlotType } from '../../modules/Graph/types'
import { DragDropHelper } from '../../modules/DragDrop'

const makeSlot = ( slot: UISlotType, datainfo, sclick ) => {
  const flags = slot.flags
  const { x, y } = slot.pos
  const klass = Object.assign ( {}, flags, { slot: true })
  const slotinfo = `${datainfo}-${slot.idx}`
  const transform = `translate(${x}, ${y})`
  const spath = flags.detached || flags.incompatible
                ? <path d={ slot.path } class={ klass }/>
                : ''

  return <g transform={ transform }>
      { spath }
      <g class='sclick' data-drop={ slotinfo }>
        <path d={ slot.click }
          on-click={ ( e ) => sclick ( e, slot.idx ) } class='click' />
        <path d={ slot.plus }
          class='plus'/>
      </g>
    </g>
}

export const Node = Component
( { blockId: [ 'user', 'blockId' ]
  , move: [ '$dragdrop', 'move' ] // react to drag op
  }
, ( { state, props, signals }: ContextType ) => {
    const uinode: UINodeType = props.uinode
    const node: NodeType = props.node
    const ownerType = props.ownerType
    // Position in parent
    const slotIdx = props.slotIdx
    const x = uinode.pos.x
    const y = uinode.pos.y
    const transform = `translate(${x},${y})`
    const datainfo = `${ownerType}-${uinode.id}`

    const klass = { sel: node.blockId === props.blockId
                  , [ uinode.className ]: true
                  , invalid: uinode.invalid
                  , node: true
                  }

    const { click, mousedown, mousemove, mouseup } = DragDropHelper.drag
    ( signals
    , ( nodePos, copy ) => {
        // start drag
        signals.$dragdrop.drag
        ( { drag:
            { ownerType
            , nodeId: node.id
            , nodePos
            , copy
            }
          } )
          // initial target
          return `${ownerType}-${node.parent}-${uinode.slotIdx}`
      }
    , ( e ) => {
        // normal click
        signals.block.select ( { select: { id: node.blockId, nodeId: node.id, ownerType } } )
      }
    )

    const arrowclick = ( e: MouseEvent ) => {
      e.stopPropagation ()

      signals.block.arrow
      ( { arrow: { nodeId: node.id, ownerType, closed: !node.closed } } )
    }

    const slotclick = ( e, pos ) => {
      e.stopPropagation ()

      signals.block.add
      ( { pos
        , parentId: uinode.id
        , ownerType
        }
      )
    }
    const arrow = uinode.arrow

    return <g transform={ transform }>
        <path d={ uinode.path } class={ klass }
          data-drop={ datainfo }
          on-mousedown={ mousedown }
          on-mouseup={ mouseup }
          on-mousemove={ mousemove }
          on-click={ click }
          ></path>
        <text x={ uinode.size.tx } y={ uinode.size.ty }>
          { uinode.name }
        </text>
        <path d={ arrow.path } class={ arrow.class }></path>
        <path d={ arrow.click }
          on-click={ arrowclick } class='arrowclick'></path>
        { uinode.slots.map
          ( ( s ) => makeSlot ( s, datainfo, slotclick ) )
        }
      </g>
  }
)
