import { ComponentType } from '../../Graph/types/ComponentType'
import { loadProject, sceneChanged, projectChanged } from './ProjectFileStorage'
import { loadLibrary, loadComponents, componentChanged } from './LibraryFileStorage'
declare var process: any

const callbacks: any = {}

const event =
{ sender:
  { send ( ...args ) {
      process.send ( args )
    }
  }
}

process.on ( 'message', ( args ) => {
  const type = args.shift ()
  const clbk = callbacks [ type ]
  if ( clbk ) {
    try {
      clbk ( event, ...args )
    }
    catch ( err ) {
      console.log ( 'fsworker error', err )
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
