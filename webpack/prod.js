const AddAssetHtmlPlugin = require ( 'add-asset-html-webpack-plugin' )
const CopyWebpackPlugin = require ( 'copy-webpack-plugin' )
const GitRevisionPlugin = require ( 'git-revision-webpack-plugin' )
const HtmlWebpackPlugin = require ( 'html-webpack-plugin' )
const merge = require ( 'webpack-merge' )
const webpack = require ( 'webpack' )

const app = require ( './app' )
const parts = require ( './parts' )
const PatchWebpackPlugin = require ( './patch-webpack-plugin' )

const DIST = 'output/dist'
const path = parts.path

module.exports = merge
( [ app ( DIST )
  , { plugins:
      [ new webpack.LoaderOptionsPlugin
        ( { minimize: true
          , debug: false
          }
        )
      , new PatchWebpackPlugin
        ( { files:
            [ { filename: 'serviceWorker.js'
              , patterns:
                [ 'output/dist/**/*'
                , '!output/dist/serviceWorker.js'
                , '!output/dist/CNAME'
                , '!output/dist/COMMITHASH'
                , '!output/dist/shippable.yml'
                , '!output/dist/*-manifest.json'
                , '!output/dist/.gitignore'
                , '!output/dist/*.map'
                ]
              , extraAssets:
                [ '/'
                ]
              , patch ( filename, content, { assets } ) {
                  return content.replace ( 'process.env.ASSETS', JSON.stringify ( assets, null, 2 ) )
                }
              }
            ]
          }
        )
      // , new webpack.optimize.UglifyJsPlugin ()
      // , new webpack.optimize.ModuleConcatenationPlugin ()
      , new CopyWebpackPlugin
        ( [ { from: path ( 'src/assets/CNAME' )
            , to: path ( DIST )
            }
          , { from: path ( 'src/assets/shippable.yml' )
            , to: path ( DIST )
            }
          , { from: path ( 'src/assets/.gitignore' )
            , to: path ( DIST )
            }
          ]
        )
      , new webpack.DefinePlugin
        ( { 'process.env.NODE_ENV': JSON.stringify ( 'production' )
          }
        )
      ]
    }
  , parts.extractCSS
    ( { use:
        [ 'css-loader', 'sass-loader' ] 
      }
    )
  ]
)
