const path = require ( 'path' )
const webpack = require('webpack')

module.exports =
{ entry: './boot/electron.ts'
, output:
  { path: path.resolve ( __dirname, 'app', 'build' )
  , filename: 'electron.js'
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
}
