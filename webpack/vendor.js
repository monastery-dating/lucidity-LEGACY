const merge = require ( 'webpack-merge' )
const webpack = require('webpack')
const common = require ( './common' )
const parts = require ( './parts' )

const DIST = 'output/dist'

module.exports = merge
( [ common
  , parts.output
    ( DIST
    , { library: '[name]_[hash]' 
      , filename: '[name].dll.js'
      }
    )
  , parts.extractCSS
    ( { use:
        [ 'css-loader', 'sass-loader' ] 
      }
    )
  , { entry:
      { vendor:
        [ 'cerebral'
        , 'cerebral/devtools'
        , 'cerebral/operators'
        , 'cerebral/tags'
        , '@cerebral/firebase'
        , '@cerebral/firebase/operators'
        , '@cerebral/react'
        , '@cerebral/router'
        , 'function-tree'
        // 408 kB
        , 'react'
        , 'react-dom'
        // 1.16 MB
        , 'seedrandom' // 4.95 choosing alea and minified
        // 1.91 MB (instead of 3.56 MB before)
        , './node_modules/font-awesome/css/font-awesome.min.css'
        // 1.96 MB
        ]
      }
    , plugins:
      [ new webpack.LoaderOptionsPlugin
        ( { minimize: true
          , debug: false
          }
        )
      , new webpack.DllPlugin
        (   // The path to the manifest file which maps between
            // modules included in a bundle and the internal IDs
            // within that bundle
          { name: '[name]_[hash]'
          , path: parts.path ( `${ DIST }/[name]-manifest.json` )
          }
        )
      , new webpack.DefinePlugin
        ( { 'process.env.NODE_ENV': JSON.stringify ( 'production' )
          }
        )
      ]
    }
  ]
)
