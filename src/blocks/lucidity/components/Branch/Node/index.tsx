import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import { NodeType, UINodeType, UISlotType } from '../../../lib/Graph/types'
import { DragDropHelper } from '../../../lib/DragDrop'

import './style.scss'

function classNames ( obj: any ) {
  return Object.keys ( obj ).filter ( k => obj [ k ] ).join ( ' ' )
}

const makeSlot = ( slot: UISlotType, datainfo: any, sclick: any ) => {
  const flags = slot.flags
  const { x, y } = slot.pos
  const klass = [ 'slot', ... Object.keys ( flags ) ].join ( ' ' )
  const slotinfo = `${datainfo}-${slot.idx}`
  const transform = `translate(${x}, ${y})`
  const spath = flags.detached || flags.incompatible
                ? <path d={ slot.path } className={ klass }/>
                : ''

  return <g key={ slotinfo } transform={ transform }>
      { spath }
      <g
        className='sclick'
        data-drop={ slotinfo }
        >
        <path 
          d={ slot.click }
          onClick={ e => sclick ( e, slot.idx ) } className='click'
          />
        <path d={ slot.plus }
          className='plus'
          />
      </g>
    </g>
}

interface Props {
  add: typeof Signal.branch.add
  arrow: typeof Signal.branch.arrow
  blockId: typeof State.branch.$blockId // user.blockId ?
  drag: typeof Signal.branch.drag
  drop: typeof Signal.branch.drop
  move: typeof Signal.branch.move
  // move: typeof State.branch.$move // $dragdrop.move ?
  select: typeof Signal.branch.select
}

interface EProps {
  node: NodeType
  ownerType: string
  uinode: UINodeType  
}

export const Node = connect < Props, EProps > (
  { add: signal`branch.add`
  , arrow: signal`branch.arrow`
  , blockId: state`branch.$blockId`
  , drag: signal`branch.drag`
  , drop: signal`branch.drop`
  , move: signal`branch.move`
  , select: signal`branch.select`
  }
, function Node
  ( { add, arrow, blockId, drag, drop, move
    , node, ownerType, select, uinode
    }
  ) {
    // Position in parent
    const x = uinode.pos.x
    const y = uinode.pos.y
    const transform = `translate(${x},${y})`
    const datainfo = `${ownerType}-${uinode.id}`

    const klass = 
    { sel: node.blockId === blockId
    , [uinode.className]: true
    , invalid: uinode.invalid
    , node: true
    }

    const { click, mousedown, mousemove, mouseup } = DragDropHelper.drag
    ( { drag, drop, move }
    , ( nodePos, copy ) => {
        // start drag
        drag
        ( { drag:
            { copy
            , nodeId: node.id
            , nodePos
            , ownerType
            }
          }
        )
          // initial target
          return `${ownerType}-${node.parent}-${uinode.slotIdx}`
      }
    , ( e ) => {
        // normal click
        select ( { select: { id: node.blockId, nodeId: node.id, ownerType } } )
      }
    )

    const arrowclick = ( e: React.MouseEvent<SVGElement> ) => {
      e.stopPropagation ()

      arrow
      ( { arrow: { nodeId: node.id, ownerType, closed: !node.closed } } )
    }

    const slotclick = ( e: React.MouseEvent< SVGElement >, pos: number ) => {
      e.stopPropagation ()

      add
      ( { pos
        , parentId: uinode.id
        , ownerType
        }
      )
    }
    const uiArrow = uinode.arrow

    return <g transform={ transform }>
        <path d={ uinode.path } className={ classNames ( klass ) }
          data-drop={ datainfo }
          onMouseDown={ mousedown }
          onMouseUp={ mouseup }
          onMouseMove={ mousemove }
          onClick={ click }
          ></path>
        <text x={ uinode.size.tx } y={ uinode.size.ty }>
          { uinode.name }
        </text>
        <path d={ uiArrow.path } className={ classNames ( uiArrow.class ) }></path>
        <path d={ uiArrow.click }
          onClick={ arrowclick } className='arrowclick'></path>
        { uinode.slots.map
          ( ( s ) => makeSlot ( s, datainfo, slotclick ) )
        }
      </g>
  }
)
