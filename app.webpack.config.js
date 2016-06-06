const path = require ( 'path' )
const webpack = require('webpack')

module.exports =
{ entry: './desktop/boot.tsx'
, output:
    // YES, this path is different so that we can use
    // webpack-dev-server
    // WHEN building, the app.js should be moved with other
    // desktop assets in desktop/build/app.js
  { path: path.resolve ( __dirname, 'build' )
  , filename: 'app.js'
  , publicPath: '/live-reload/'
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

, plugins:
  [ new webpack.DllReferencePlugin
    ( { context: '.'
      , manifest: require('./desktop/build/vendor-manifest.json')
      }
    )
  ]
}
