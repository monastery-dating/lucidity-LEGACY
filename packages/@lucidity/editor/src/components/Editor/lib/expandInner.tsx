import { JSX } from '../../Component'
import Element from './Element'

export default function expandInner
( path: string
, inner // FIXME: add type
) {
  return Object.keys ( inner )
  .sort ( ( a, b ) => inner [ a ].p - inner [ b ].p )
  .map
  ( elemRef => (
    <Element
      path={ path + '.i.' + elemRef }
      key={ elemRef }
      elemRef={ elemRef } />
  ))
}
