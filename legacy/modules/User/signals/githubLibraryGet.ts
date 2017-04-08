import { SignalType } from '../../context.type'
import { githubLibraryGetAction } from '../actions/githubLibraryGetAction'
import { status } from '../../Status'
import * as copy from 'cerebral-addons/copy'

export const githubLibraryGet: SignalType =
[ githubLibraryGetAction
, { success:
    [ copy ( 'input:/', 'state:/github' ) ]
  , error:
    [ status ]
  }
]
