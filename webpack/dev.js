const AddAssetHtmlPlugin = require ( 'add-asset-html-webpack-plugin' )
const CopyWebpackPlugin = require ( 'copy-webpack-plugin' )
const GitRevisionPlugin = require ( 'git-revision-webpack-plugin' )
const HtmlWebpackPlugin = require ( 'html-webpack-plugin' )
const merge = require ( 'webpack-merge' )

const app = require ( './app' )
const parts = require ( './parts' )
const webpack = require ( 'webpack' )

const DIST = 'output/debug'
const path = parts.path

const DEBUG = false

module.exports = merge
( [ app ( DIST )
  , parts.loadCSS
    ( { use:
        [ 'style-loader', 'css-loader', 'sass-loader' ]
      }
    )
  , { plugins:
      [ new webpack.DefinePlugin
        ( { 'process.env.NODE_ENV': JSON.stringify ( DEBUG ? 'debug' : 'development' )
          }
        )
      ]
    }
  ]
)