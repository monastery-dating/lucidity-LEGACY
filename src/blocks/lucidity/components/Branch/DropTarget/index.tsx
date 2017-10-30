import { Signal, State } from 'app'
import { connect, JSX } from 'builder'
import { props, signal, state } from 'cerebral/tags'
import { styled } from 'styled'
import { UINodeType } from '../../../lib/Graph'

import './style.scss'

interface Props {
  
}

interface EProps {
  uinode: UINodeType
  slotIdx: number
}

export const DropTarget = connect < Props, EProps > (
  { 
  }
, function DropTarget ( { uinode, slotIdx } ) {
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

  return <g transform={ transform } style={{ background: 'red' }} className='DropTarget'>
     <circle className='center' r='6' cx='19.5' cy='19.5'/>
     <circle className='ring1' r='18' cx='19.5' cy='19.5'/>
     <circle className='ring2' r='18' cx='19.5' cy='19.5'/>
    </g>
  }
)