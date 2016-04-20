const glob = require ( 'glob' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const OUTFILE = path.join ( __dirname, 'bootstrap.ts' )

const posixdir = __dirname.replace ( /\\/g, '/')
glob
( posixdir + '/../app/**/*.spec.ts'
, {}
, function ( err, list ) {
    // make relative path
    const tests = list.map
    ( ( f ) => {
        const relpath = path.relative ( posixdir, f ).replace ( /\\/g, '/' )
        return `import '${ relpath.replace ( /\.ts$/, '' ) }'`
      }
    )
    fs.writeFile
    ( OUTFILE, tests.join ( '\n' ), ( err ) => {
         if ( err ) throw ( err )
         console.log ( `'${OUTFILE}' created.` )
      }
    )
  }
)
