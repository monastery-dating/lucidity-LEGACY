const fs = require ( 'fs' )
const path = require ( 'path' )
const glob = require ( 'glob-all' )

const DEFAULT_OPTIONS =
{ files: []
}

module.exports =
class PatchWebpackPlugin {

  constructor ( options ) {
    this.options = Object.assign
    ( {}
    , DEFAULT_OPTIONS
    , options
    )
    this.warnings = []
  }

  apply ( compiler ) {
    compiler.plugin
    ( 'after-emit'
    , ( compilation, callback ) => {
        this.options.files.forEach
        ( ( { filename, patch, patterns, extraAssets } ) => {
            try {
              const assets = this.getAssets ( compiler, filename, patterns, extraAssets )
              const fullpath = path.resolve ( compiler.outputPath, filename )
              const content = fs.readFileSync ( fullpath, { encoding: 'utf8' } )
              fs.writeFileSync ( fullpath, patch ( filename, content, { assets, compilation, compiler } ) )
            } catch ( err ) {
              console.log ( err )
              this.warnings.push ( err )
            }
          }
        )
        this.outputWarnings ( compilation )
      }
    )
  }

  getAssets ( compiler, filename, patterns, extra ) {
    if ( ! patterns ) {
      throw new Error ( `Missing 'patterns' in config to patch '${ filename }.`)
    }
    const { outputPath } = compiler
    const base = path.resolve ( outputPath )
    const list = glob.sync ( patterns )
    if ( !list ) {
      throw new Error
      ( `glob ${ JSON.stringify ( patterns ) } did not return any asset.` )
    }
    return list
    .filter ( f => ! fs.statSync ( f ).isDirectory () )
    .map ( f => path.relative ( base, path.resolve ( f ) ) )
    .concat ( extra || [] )
  }

  outputWarnings ( compilation ) {
    this.warnings.forEach ( warning => compilation.warnings.push ( warning ) )
  }
}