import { ComponentType } from '../../Graph/types/ComponentType'
import { loadProject, sceneChanged, projectChanged } from './ProjectFileStorage'
import { loadLibrary, loadComponents, componentChanged } from './LibraryFileStorage'
import { debug } from './FileStorageUtils'
declare var process: any

const callbacks: any = {}

const send =
( ...args ) => {
  process.send ( args )
}

const event =
{ sender: { send }
}

process.on ( 'message', ( args ) => {
  const type = args.shift ()
  const clbk = callbacks [ type ]
  if ( clbk ) {
    try {
      console.log ( `\n ==== ${type} ====` )
      clbk ( event, ...args )
    }
    catch ( err ) {
      console.log ( 'fsworker error', err )
      send ( 'error', err )
    }
  }
  else {
    console.log ( `Unknown event '${type}'.`)
  }
})

const ipcMain =
{ on ( type, clbk ) {
    callbacks [ type ] = clbk
  }
}

export const start = () => {

  ipcMain.on ( 'open-project', ( event ) => {
    // User can choose a project
    // Not implemented yet
  })

  ipcMain.on ( 'load-project', loadProject )
  ipcMain.on ( 'load-library', loadLibrary )
  ipcMain.on ( 'load-components', loadComponents )
  ipcMain.on ( 'component-changed', componentChanged )
  ipcMain.on ( 'project-changed', projectChanged )
  ipcMain.on ( 'scene-changed', sceneChanged )
}
