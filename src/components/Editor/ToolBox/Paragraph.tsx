import { JSX, connect } from '../../Component'
import { signal } from 'cerebral/tags'
import getSelection from '../lib/getSelection'

export default connect
( { applyOp: signal`editor.applyOpTriggered`
  }
, function Paragraph ( { applyOp } ) {
    const click = ( e, op, opts ) => {
      const selection = getSelection ()
      applyOp ( { op, selection, opts } )
      e.preventDefault ()
    }
    const onMouseDown = e => e.preventDefault ()
    return (
      <div className='ToolBox-menu'>
        {[1, 2, 3].map(h => (
          <div key={h} className='ToolBox-item'
            onClick={e => click(e, 'P', {h})}
            onMouseDown={onMouseDown}>
            <i className='heading'>H{h}</i>
          </div>
        ))}
        <div className='ToolBox-item'
          onClick={e => click(e, 'P', null)}
          onMouseDown={onMouseDown}>
          <i className='para'>P</i>
        </div>
      </div>
    )
  }
)
