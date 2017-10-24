import { JSX, connect } from '../Component'
import { v4 } from 'uuid'
import Composition from './Composition'
import ToolBox from './ToolBox'

/*
export default connect
( null
, 
*/
export default function Editor () {
    // This editorRef should be unique for each <Editor /> tag.
    const ref = v4 ().substr ( 0, 5 )
    return (
      <div className='Editor'>
        <div className='Editor-wrapper' id={ ref }>
          <Composition />
          <ToolBox editorId={ ref }/>
        </div>
      </div>
    )
  }
  /*
)
*/
