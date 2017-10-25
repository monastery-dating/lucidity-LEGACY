const path = require ( 'path' )
const ExtractTextPlugin = require ( 'extract-text-webpack-plugin' )

exports.path = ( folder ) => (
  path.resolve ( __dirname, '..', folder )
)

exports.extractCSS = ( { use } ) => {
  const extractPlugin = new ExtractTextPlugin
	( { filename: '[name].css' }
	)
  return (
    { module:
      { loaders:
        [ { test: /\.s?css$/
          , use: extractPlugin.extract
              ( { use
                , fallback: 'style-loader'
                }
              )
          }
        ]
      }
    , plugins:
      [ extractPlugin
      ]
    }
  )
}

exports.loadCSS = ( { use } ) => (
  { module:
    { loaders:
      [ { test: /\.s?css$/
        , use
        }
      ]
    }
  }
)

exports.output = ( folder, opts ) => (
  { output: Object.assign
    ( {}
    , { path: exports.path ( folder )
      , filename: '[name].js'
      }
    , opts || {}
    )
  }
)

exports.loaders =
{ module:
  { loaders:
    [ { test: /\.tsx?$/
      , exclude: /node_modules/
      , use: 'ts-loader?logLevel=warn'
      }
    , { test: /\.(jpg|png|svg)$/
      , use:
        { loader: 'file-loader'
        , options:
          { name: 'assets/[name].[ext]'
          , include: exports.path ( 'src/assets' )
          , useRelativePath: true
          }
        }
      }
    , { test: /\.(eot|woff|woff2|ttf)(\?v=\d+\.\d+\.\d+)?$/
      , loader: "file-loader"
      , options:
        { name: 'assets/[name].[ext]'
        , useRelativePath: true
        }
      }
    ]
  }
}
