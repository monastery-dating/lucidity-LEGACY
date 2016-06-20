const path = require ( 'path' )
const webpack = require('webpack')

module.exports =
{ entry: './modules/Code/helper/codeWorker.ts'
, output:
  { path: path.resolve ( __dirname, 'desktop', 'build' )
  , filename: 'vendor.js'
  , filename: 'codeWorker.js'
  }
, devtool: 'source-map'
, resolve:
  { extensions: ['', '.js', '.ts', '.tsx']
  }
, module:
  { loaders:
    [ { test: /(\.js|\.ts|\.tsx)$/
      , exclude: /node_modules/
      , loader: 'ts-loader'
      }
    , { test: /\.txt$/
      , exclude: /node_modules/
      , loader: 'raw-loader'
      }
    , { test: /\.s?css$/
      , loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  }

/* We do not want to load the full vendor stuff in the worker.
, plugins:
  [ new webpack.DllReferencePlugin
    ( { context: '.'
      , manifest: require('./desktop/build/vendor-manifest.json')
      }
    )
  ]
*/
}
