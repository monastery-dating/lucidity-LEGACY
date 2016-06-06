const path = require ( 'path' )
const webpack = require('webpack')

module.exports =
{ entry: './desktop/boot.tsx'
, output:
  { path: path.resolve ( __dirname, 'desktop', 'build' )
  , filename: 'vendor.js'
  , library: 'vendor_lib'
  }
, entry:
  { // create two library bundles, one with jQuery and
    // another with Angular and related libraries
    'vendor':
    [ 'cerebral'
    , 'cerebral-module-devtools'
    , 'cerebral-module-http'
    , 'cerebral-model-baobab'
    , 'cerebral-view-snabbdom'
    , 'baobab'
    , 'codemirror'
    , 'pouchdb'
    , 'pouchdb-authentication'
    , 'check-types'
    // ?
    , 'raw-loader'
    // , 'cerebral-addons'
    ////
    // playback
    , 'typescript'
    , 'three'
    ]
  }
, devtool: 'source-map'

, plugins:
  [ new webpack.DllPlugin
    (   // The path to the manifest file which maps between
        // modules included in a bundle and the internal IDs
        // within that bundle
      { name: 'vendor_lib'
      , path: 'desktop/build/vendor-manifest.json'
      }
    )
  ]

}
