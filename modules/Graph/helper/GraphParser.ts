import { ComponentType, GraphType, rootNodeId } from '../types'

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

export const exportGraph =
( graph: GraphType
, context: any // this is the context passed for root element
, file: FileExport
, folder: FolderExport
) => {
  exportOne ( graph, context, file, folder, rootNodeId )
}

export const exportDoc =
( scene: ComponentType
, context: any
, file: FileExport
, folder: FolderExport
) => {
  saveSettings ( scene, context, file, folder )

  const ctx = folder ( context, scene.name )
  exportOne ( scene.graph, ctx, file, folder, rootNodeId )
}

const saveSettings =
( scene: ComponentType
, context: any
, file: FileExport
, folder: FolderExport
) => {
  const doc = Object.assign ( {}, scene )
  delete doc.graph
  delete doc.scenes
  const json = JSON.stringify ( doc, null, 2 )
  file ( context, `${scene.name}.lucy`, json, null )
}
