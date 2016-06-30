import { ComponentType } from '../../Graph/types/ComponentType'
import { loadProject, sceneChanged, projectChanged } from './ProjectFileStorage'
import { loadLibrary, loadComponents, componentChanged } from './LibraryFileStorage'
import { preferences } from './Preferences'
declare var require: any
const fs = require ( 'fs' )
const { ipcMain, dialog } = require ( 'electron' )

export const start = ( win ) => {

  // This communication is not async: we want to block until we get
  // the preferences.
  ipcMain.on ( 'preferences', preferences )

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

  ipcMain.on ( 'select-project-path', ( event ) => {
    // New project or web project open in electron for the first time.
    dialog.showOpenDialog
    ( win
    , { properties: [ 'openDirectory', 'createDirectory' ]
      , title: `Please select a folder for the project.`
      }
    , function ( paths ) {
        event.sender.send ( 'project-path-selected', paths [ 0 ] )
      }
    )
  })

  ipcMain.on ( 'select-library-path', ( event ) => {
    // New project or web project open in electron for the first time.
    dialog.showOpenDialog
    ( win
    , { properties: [ 'openDirectory', 'createDirectory' ]
      , title: `Please select a directory to store the library.`
      }
    , function ( paths ) {
        event.sender.send ( 'library-path-selected', paths [ 0 ] )
      }
    )
  })

}
