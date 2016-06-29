import { ComponentType, GraphType, rootNodeId } from '../types'
import { rootBlockId } from '../../Block/BlockType'

interface FileExport {
  ( folderHelper: any, name: string, source: string, id: string ): void
}

interface FolderExport {
  ( folderHelper: any, name: string ): any
}

const exportOne =
( graph: GraphType
, context: any
, file: FileExport
, folder: FolderExport
, nodeId: string
, slotref?: string
) => {
  const node = graph.nodesById [ nodeId ]
  const block = graph.blocksById [ node.blockId ]
  const name = slotref ? `${slotref} ${block.name}` : block.name
  file ( context, `${name}.ts`, block.source, block.id )
  let sub
  const children = node.children
  for ( let i = 0; i < children.length; ++i ) {
    const slotref = String ( i + 1 ) // i < 10 ? `0${i}` : String ( i )
    const childId = children [ i ]
    if ( childId ) {
      if ( !sub ) {
        // create folder for children
        sub = folder ( context, name )
      }
      exportOne ( graph, sub, file, folder, childId, slotref )
    }
  }
}

// FIXME: Is this used ?
export const exportGraph =
( graph: GraphType
, context: any // this is the context passed for root element
, file: FileExport
, folder: FolderExport
) => {
  exportOne ( graph, context, file, folder, rootNodeId )
}

const saveSettings =
( comp: ComponentType
, context: any
, file: FileExport
, folder: FolderExport
) => {
  const doc = Object.assign ( {}, comp )
  delete doc.graph
  delete doc.scenes
  const json = JSON.stringify ( doc, null, 2 )
  file ( context, `${comp.name}.lucy`, json, null )
}

export const exportDoc =
( comp: ComponentType
, context: any
, file: FileExport
, folder: FolderExport
) => {
  const block = comp.graph.blocksById [ rootBlockId ]
  if ( comp.type === 'component'
       && Object.keys ( comp.graph.nodesById ).length === 1
       && block
       && ( !block.sources || Object.keys ( block.sources ).length === 0 )
     ) {
    // single file component: just output ${comp.name}.ts
    file ( context, `${comp.name}.ts`, block.source, block.id )
  }
  else {
    saveSettings ( comp, context, file, folder )

    const ctx = folder ( context, comp.name )
    exportOne ( comp.graph, ctx, file, folder, rootNodeId )
  }
}
