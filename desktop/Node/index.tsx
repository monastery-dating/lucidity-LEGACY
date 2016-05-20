import './style.scss'
import { Component } from '../Component'
import { ContextType } from '../../modules/context.type'
import { UINodeType } from '../../modules/Graph/types'

export const Node = Component
( { // layout ...
  }
, ( { state, props }: ContextType ) => {
    const uinode: UINodeType = props.uinode
    const x = uinode.pos.x
    const y = uinode.pos.y
    const transform = `translate(${x},${y})`
    const klass = { [uinode.className]: true, ghost:uinode.isGhost }

    return <g transform={ transform }>
        <path d={ uinode.path } class={ klass }></path>
        <text x={ uinode.size.tx } y={ uinode.size.ty }>
          { uinode.name }
        </text>
        { uinode.slots.map ( ( s ) =>
          <path d={ s.path } class={ s.className }/>
        )}
      </g>
  }
)
