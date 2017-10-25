const AddAssetHtmlPlugin = require ( 'add-asset-html-webpack-plugin' )
const CopyWebpackPlugin = require ( 'copy-webpack-plugin' )
const GitRevisionPlugin = require ( 'git-revision-webpack-plugin' )
const HtmlWebpackPlugin = require ( 'html-webpack-plugin' )
const merge = require ( 'webpack-merge' )

const common = require ( './common' )
const parts = require ( './parts' )
const webpack = require ( 'webpack' )

const gitRevisionPlugin = new GitRevisionPlugin ()
const path = parts.path

/** This is shared by prod and dev
 * 
 */
module.exports = dist => merge
( [ common
  , parts.output ( dist )
  , { entry:
      { app: './src/app/index.ts'
      , serviceWorker: './src/app/serviceWorker.ts'
      }
    , plugins:
      [ new AddAssetHtmlPlugin
        ( { filepath: path ( `output/dist/vendor.dll.js` )
          , hash: true
          }
        )
      , new HtmlWebpackPlugin
        ( { template: path ( 'src/index.html' )
          , chunks: [ 'app' ]
          , hash: true
          }
        )
      , gitRevisionPlugin 
      , new webpack.DllReferencePlugin
        ( { context: '.'
          , manifest: require ( path ( `output/dist/vendor-manifest.json` ) )
          }
        )
      , new webpack.DefinePlugin
        ( { 'process.env.VERSION': JSON.stringify ( gitRevisionPlugin.version () )
          , 'process.env.COMMITHASH': JSON.stringify ( gitRevisionPlugin.commithash () )
          }
        )
      ]
    }
  ]
)