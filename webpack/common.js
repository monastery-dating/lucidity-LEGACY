const merge = require ( 'webpack-merge' )
const parts = require ( './parts' )
const HtmlWebpackPlugin = require ( 'html-webpack-plugin' )
const AddAssetHtmlPlugin = require ( 'add-asset-html-webpack-plugin' )

/**
 * This is shared by vendor, dev and prod
 */
module.exports = merge
( [ parts.loaders
  , { resolve:
      { extensions: [ '.js', '.ts', '.tsx' ]
      , alias:
        // All alias here must be duplicated in tsconfig.json
        // The ones used for testing also need to be in jest config (package.json)
        { vexflow: parts.path ( 'node_modules/vexflow/releases/vexflow-min.js' )
        , tone: parts.path ( 'node_modules/tone/build/Tone.min.js' )
        , seedrandom: parts.path ( 'node_modules/seedrandom/lib/alea.min.js' )
        // ?? , './node_modules/font-awesome/css/font-awesome.min.css'

        // Helpers
        , app: parts.path ( 'src/app' )
        , auth: parts.path ( 'src/blocks/firebase/auth' )
        , blocks: parts.path ( 'src/blocks' )
        , builder: parts.path ( 'src/blocks/builder' )
        , config: parts.path ( 'src/config' )
        , data: parts.path ( 'src/blocks/firebase/data' )
        , editor: parts.path ( 'src/blocks/editor' )
        , error: parts.path ( 'src/blocks/error' )
        , lucidity: parts.path ( 'src/blocks/lucidity' )
        , lib: parts.path ( 'src/lib' )
        , src: parts.path ( 'src' )
        , styled: parts.path ( 'src/styled' )

        // App specific
        , melogen: parts.path ( 'src/lib/melogen' )
        , playback: parts.path ( 'src/lib/playback' )
        , vexdraw: parts.path ( 'src/lib/vexdraw' )
        }
      }
    , devtool: 'source-map'
    }
  ]
)
