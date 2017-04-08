import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { UINodeType } from '../../modules/Graph'

export const DropTarget = Component
( {}
, ( { state, props, signals }: ContextType ) => {
  const uinode: UINodeType = props.uinode
  const slotIdx: number = props.slotIdx
  const slot = uinode.slots [ slotIdx ]
  let transform = ''
  if ( slot ) {
    const x = uinode.pos.x + slot.pos.x - 20
    const y = uinode.pos.y + slot.pos.y - 20
    transform = `translate(${x},${y})`
  }
  else {
    // ??
    const x = uinode.pos.x - 2
    const y = uinode.pos.y - 2
    transform = `translate(${x},${y})`
  }

  return <g transform={ transform } style={{ background: 'red' }} class='DropTarget'>
     <circle class='center' r='6' cx='19.5' cy='19.5'/>
     <circle class='ring1' r='18' cx='19.5' cy='19.5'/>
     <circle class='ring2' r='18' cx='19.5' cy='19.5'/>
    </g>
  }
)
