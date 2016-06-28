import { ActionContextType } from '../../context.type'
import { createProject } from '../../Project'

export const checkName =
( { state
  , input: { doc }
  , output
  } : ActionContextType
) => {
  if ( doc.name === 'scenes' ) {
    output.error ( { status: { type: 'error', message: `Invalid project name '${doc.name}'.` } } )
  }
  else {
    output.success ()
  }
}
