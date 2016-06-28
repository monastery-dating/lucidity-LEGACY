import { GraphType, rootNodeId } from '../types'

interface FileExport {
  ( folderHelper: any, name: string, source: string ): void
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
  file ( context, `${name}.ts`, block.source )
  let sub
  const children = node.children
  for ( let i = 0; i < children.length; ++i ) {
    const slotref = i < 10 ? `0${i}` : String ( i )
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

export const exportGraph =
( graph: GraphType
, context: any // this is the context passed for root element
, file: FileExport
, folder: FolderExport
) => {
  exportOne ( graph, context, file, folder, rootNodeId )
}
