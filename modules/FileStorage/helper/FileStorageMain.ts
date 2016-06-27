// FileStorageHelper runs on the window process.
// This helper runs on the main process.

declare var require: any
const { ipcMain, dialog } = require ( 'electron' )
const fs = require ( 'fs' )
const path = require ( 'path' )

const FILE_STATUS = {}

// Latest project and scene saved to fs
let project
let scene

// User selected project and library paths
// FIXME !!! "open project" and "select library" (where is default lib path ?)
let projectPath = '/Users/gaspard/git/lucidity.project'
let libraryPath = '/Users/gaspard/git/lucidity.library/components'

export const start = () => {
  ipcMain.on ( 'open-project', () => {
    // TODO
  })

  ipcMain.on ( 'project-changed', ( event, doc ) => {
    // TODO: save [project name].lucy in folder
    const name = doc.name
    fs.writeFile ( `${name}.lucy`, JSON.stringify ( doc, null, 2 ) )
    if ( project ) {
      if ( project.name !== doc.name ) {
        // remove old file
        const n = `${project.name}.lucy`
        const p = path.resolve ( projectPath, n )
        const f = fs.statSync ( p )
        if ( f && f.isFile () ) {
          fs.unlink ( p, ( err ) => {
            console.log ( err )
          })
        }
      }
    }
    project = doc
  })

  ipcMain.on ( 'scene-changed', ( event, doc ) => {

  })

  ipcMain.on ( 'save-component', ( event, component ) => {
    // Save component to library
  })

  /* TODO: optimize with:
  ipcMain.on ( 'source-changed', ( event, { blockId, source } ) => {

  })
  */
}
