const path = require ( 'path' )
const webpack = require('webpack')

module.exports =
{ entry: './src/boot.tsx'
, node:
  { __dirname: false
  }
, output:
  { path: path.resolve ( __dirname, 'app', 'build' )
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
      /*
    , { test: /\.css$/
      , loader: 'style!css?sourceMap'
      }
      */
    , { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/
      , loader: "url?limit=10000&mimetype=application/font-woff"
      }
    , { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/
      , loader: "url?limit=10000&mimetype=application/font-woff"
      }
    , { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/
      , loader: "url?limit=10000&mimetype=application/octet-stream"
      }
    , { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/
      , loader: "file"
      }
    , { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/
      , loader: "url?limit=10000&mimetype=image/svg+xml"
      }
    ]
  }

, plugins:
  [ new webpack.DllReferencePlugin
    ( { context: '.'
      , manifest: require('./app/build/vendor-manifest.json')
      }
    )
  , new webpack.ExternalsPlugin ( 'commonjs', [ 'child_process', 'fs', 'path' ] )
  ]
}
