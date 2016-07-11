import { describe } from '../../Test'
import { createGraph, insertGraph } from '../../Graph/helper/GraphHelper'
import { createProject } from '../../Project/helper/ProjectHelper'
import { ComponentType, GraphType, Immutable as IM, rootNodeId } from '../../Graph'
import { rootBlockId, nextBlockId } from '../../Block'
import { loadProject } from './FileStorageHelper'
declare var require: any

// FIXME: how to make it so that these tests do not interfere with app ?
// Could run tests in a completely different process... Something close to
// what we would do with opening multiple documents.

const SOURCE_foo =
`
import { Init, Update, Meta } from 'lucidity'

export const init: Init =
( { asset, children, cache, detached } ) => {
  asset.source ( 'foo.lua', ( src ) => {
    cache.foo = src
  })
}
`

const SOURCE_foo_lua =
`
-- This is a foo.lua
`

if ( !window [ 'process' ] ) {
  describe ( 'FileStorage in browser' , ( it ) => {
    it ( 'should do nothing', ( assert ) => {
      // ...
    })
  })
}

else {

  describe ( 'FileStorage in node' , ( it, setupDone ) => {

    let project: ComponentType
    let scene: ComponentType
    let foo: GraphType
    let main: GraphType
    let fooId: string

    Promise.all
    ( [ createProject ()
        .then ( ( o ) => { project = o.project; scene = o.scene } )
      , createGraph ( 'foo', SOURCE_foo )
        .then ( ( g ) => { foo = g })
      , createGraph ( 'main' )
        .then ( ( g ) => { main = g } )
      ]
    )
    .then ( () => {
      scene = IM.update ( scene, 'graph', ( graph ) => {
        fooId = nextBlockId ( graph.blocksById )
        foo = IM.update
        ( foo, 'blocksById', rootBlockId, 'sources',  'main.lua', SOURCE_foo_lua )
        return insertGraph ( graph, rootNodeId, 0, foo )
      })
      scene = IM.update ( scene, 'name', 'Intro' )
      project = IM.update ( project, 'name', 'Girls' )
      setupDone ()
    })

    it ( 'should setup test correctly', ( assert ) => {
      assert.equal
      ( scene.graph.blocksById [ 'b1' ].sources [ 'main.lua' ]
      , SOURCE_foo_lua
      )

      assert.equal
      ( project.name
      , 'Girls'
      )
    })

    const fs = require ( 'fs' )
    const path = require ( 'path' )
    const tmpdir = require ( 'os' ).tmpdir ()

    const clearPath = ( dirpath ) => {
      if ( dirpath.substr ( 0, tmpdir.length ) !== tmpdir ) {
        throw `Will not remove files outside of tmp dir '${tmpdir}'.`
      }

      const list = fs.readdirSync ( dirpath )
      for ( let i = 0; i < list.length; ++i ) {
        const filepath = path.join ( dirpath, list [ i ] )
        const s = fs.statSync ( filepath )
        if ( s.isDirectory () ) {
          clearPath ( filepath )
        }
        else {
          fs.unlinkSync ( filepath )
        }
      }
      fs.rmdirSync ( dirpath )
    }

    const stat =
    ( path: string ): any => {
      try {
        return fs.statSync ( path )
      }
      catch ( err ) {
        return null
      }
    }

    const hasFile = ( basedir, filepath, assert, content? ) => {
      const p = path.join ( basedir, filepath )
      const s = stat ( p )
      assert.equal
      ( s && s.isFile () ? p : null
      , p
      )
      if ( content ) {
        assert.equal
        ( fs.readFileSync ( p, 'utf8' )
        , content
        )
      }
    }

    it ( 'should write all files on loadProject', ( assert, done ) => {
      const tmppath = path.join ( tmpdir, 'io.lucidity.test.FileStorage' )
      if ( !stat ( tmppath ) ) {
        fs.mkdirSync ( tmppath )
      }
      loadProject
      ( tmppath
      , project
      , [ scene ]
      , () => {
        hasFile ( tmppath, 'Girls.lucy', assert )
        hasFile ( tmppath, 'project/lucidity.json', assert )
        hasFile ( tmppath, 'project/main-b0.ts', assert )
        hasFile ( tmppath, 'scenes/Intro/lucidity.json', assert )
        hasFile ( tmppath, 'scenes/Intro/main-b0.ts', assert )
        hasFile ( tmppath, 'scenes/Intro/foo-b1.ts', assert )
        hasFile ( tmppath, 'scenes/Intro/main-b1.lua', assert )
        clearPath ( tmppath )
        done ()
      })
    })

  })

}
