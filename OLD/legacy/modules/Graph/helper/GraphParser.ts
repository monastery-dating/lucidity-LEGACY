import { ComponentType, GraphType, rootNodeId } from '../types'
import { rootBlockId } from '../../Block/BlockType'

interface FileExport {
  ( folderHelper: any, name: string, source: string, id: string ): void
}

interface FolderExport {
  ( folderHelper: any, name: string ): any
}

const saveSettings =
( comp: ComponentType
, context: any
, file: FileExport
, folder: FolderExport
) => {
  const doc = Object.assign ( {}, comp )
  delete doc.graph.blocksById
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
    const blocksById = comp.graph.blocksById
    for ( const bid in blocksById ) {
      const block = blocksById [ bid ]
      file ( context, `${block.name}-${block.id}.ts`, block.source, block.id )
    }
  }
}
