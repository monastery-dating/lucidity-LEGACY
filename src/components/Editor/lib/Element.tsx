import { JSX, connect } from '../../Component'
import expandInner from './expandInner'
import getElementTag from './getElementTag'
import getElementClassName from './getElementClassName'
import setSelection from './setSelection'

export default connect
( ( { path } ) => (
    { elem: `${path}.**` }
  )
, function Element ( { elem, elemRef, path } ) {
    if ( ! elem ) {
      // Do not know why we need this. parseInner should remove.
      return null
    }
    const inner = elem.i
    const Tag = getElementTag ( elem )
    const className = getElementClassName ( elem )

    return (
      <Tag data-ref={ elemRef }
        className={ className }
        ref={ n => setSelection ( n, path ) }
        >
        { typeof inner === 'string'
        ? ( inner === '' ? '\u200B' : inner )
        : expandInner ( path, inner )
        }
      </Tag>
    )
  }
)
