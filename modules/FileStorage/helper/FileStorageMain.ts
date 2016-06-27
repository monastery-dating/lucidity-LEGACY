// FileStorageHelper runs on the window process.
// This helper runs on the main process.

declare var require: any
const { ipcMain, dialog } = require ( 'electron' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const sanitize = require ( 'sanitize-filename' )

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
    const p = path.resolve ( projectPath, `${ sanitize ( doc.name ) }.lucy` )

    fs.writeFile ( p, JSON.stringify ( doc, null, 2 ), 'utf8', ( err ) => {
      if ( err ) {
        console.log ( err )
      }
    })

    if ( project ) {
      if ( project.name !== doc.name ) {
        // remove old file
        const p = path.resolve ( projectPath, `${ sanitize ( project.name ) }.lucy` )
        const f = fs.statSync ( p )
        if ( f && f.isFile () ) {
          fs.unlink ( p, ( err ) => {
            if ( err ) {
              console.log ( err )
            }
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
