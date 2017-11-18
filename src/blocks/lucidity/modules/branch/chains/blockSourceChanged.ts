import { ActionContext, CerebralChain } from 'builder'
import { sequence } from 'cerebral'
import { set } from 'cerebral/operators'
import { props, state } from 'cerebral/tags'
import { getProject } from 'playback'
import { SourceChanged } from '..'

function changeSource
( { props, state }: ActionContext < SourceChanged >
) {
  const { blockId, path, source } = props
  // FIXME
  const project = getProject ()
  getProject ()
  project.setBlockSource ( blockId, source )
  const blockDef = project.blockById [ blockId ].definition ()
  state.set ( `${ path }.branch.blocks.${ blockId }`, blockDef )
}

export const blockSourceChanged: CerebralChain =
sequence
( 'branch.blockSourceChanged'
, [ changeSource
  ]
)
