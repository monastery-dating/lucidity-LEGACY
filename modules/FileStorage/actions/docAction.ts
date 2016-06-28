import { ActionContextType } from '../../context.type'
import { ComponentType, GraphType, Immutable as IM, rootNodeId } from '../../Graph'
import { updateGraphSource } from '../../Graph/helper/GraphHelper'
import { DocLoad } from '../helper/types'

const nameRe = /^\d*\s*(.+)\.ts$/
/** A file changed in FS
 */
export const docAction =
( { state
  , input
  , output
  } : ActionContextType
) => {
  const data: DocLoad = input
}

docAction [ 'async' ] = true
