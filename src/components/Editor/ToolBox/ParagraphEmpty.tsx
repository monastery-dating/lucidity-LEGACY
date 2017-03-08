import { JSX, connect } from '../../Component'

/*
export default connect
( null,
      */
export default
  function ParaToolbox () {
    return (
      <div className='ToolBox-menu'>
        <div className='ToolBox-item'>
          <i className='block'>Image</i>
        </div>
        <div className='ToolBox-item'>
          <i className='block'>Block</i>
        </div>
        <div className='ToolBox-item'>
          <i className='heading'>H1</i>
        </div>
        <div className='ToolBox-item'>
          <i className='heading'>H2</i>
        </div>
        <div className='ToolBox-item'>
          <i className='heading'>H3</i>
        </div>
        <div className='ToolBox-item'>
          <i className='para'>P</i>
        </div>
      </div>
    )
  }
/*
)
*/