const path = require ( 'path' )

module.exports =
{ entry: './desktop/boot.tsx'
  , output:
  { path: path.resolve ( __dirname, 'build' )
  , filename: 'js/app.js'
  , publicPath: '/assets/'
  }
, resolve:
  { extensions: ['', '.js', '.ts', '.tsx'] }
, module:
  { loaders:
    [ { test: /(\.js|\.ts|\.tsx)$/
      , exclude: /node_modules/
      , loader: 'ts-loader' //-loader!ts-loader'
      }
    , { test: /\.scss$/
      , loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  }
}
