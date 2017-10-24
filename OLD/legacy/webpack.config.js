const path = require ( 'path' )

module.exports =
{ entry: './desktop/boot.tsx'
, output:
  { path: path.resolve ( __dirname, 'build' )
  , filename: 'js/app.js'
  , publicPath: '/assets/'
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
