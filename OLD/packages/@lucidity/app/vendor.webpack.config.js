const GitRevisionPlugin = require ( 'git-revision-webpack-plugin' )
const path = require ( 'path' )
const webpack = require('webpack')

module.exports =
{ output:
  { path: path.resolve ( __dirname, 'app', 'build' )
  , filename: 'vendor.js'
  , library: 'vendor_lib'
  }
, entry:
  { vendor:
    [ 'cerebral'
    , 'cerebral-router'
    , 'cerebral/devtools'
    , 'cerebral/react'
    , 'cerebral/operators'
    , 'cerebral/tags'
    , 'function-tree'
    , 'react'
    , 'react-dom'
    /*
    , 'font-awesome'
    , 'bulma'
    */
    ]
  }
, devtool: 'source-map'

, module:
  { loaders:
    [ { test: /\.s?css|\.sass$/
      , loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  }

, plugins:
  [ new webpack.DllPlugin
    ( // The path to the manifest file which maps between
      // modules included in a bundle and the internal IDs
      // within that bundle
      { name: 'vendor_lib'
      , path: 'app/build/vendor-manifest.json'
      }
    )
  , new GitRevisionPlugin ()
  ]
}
