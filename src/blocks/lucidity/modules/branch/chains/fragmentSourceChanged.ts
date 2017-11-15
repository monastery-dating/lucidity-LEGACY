import { ActionContext, CerebralChain } from 'builder'
import { sequence } from 'cerebral'
import { set } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { getProject } from 'playback'

function changeSource
( { props, state }: ActionContext
) {
  const fragmentId = props.path.split ( '.' ).slice ( -1 ) [ 0 ]
  const source = props.source
  getProject ().setFragmentSource ( fragmentId, source )
}

export const fragmentSourceChanged: CerebralChain =
sequence
( 'branch.fragmentSourceChanged'
, [ set ( state`${ props`path` }.source`, props`source` )
  , changeSource
  ]
)

