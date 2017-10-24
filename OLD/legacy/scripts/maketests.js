const glob = require ( 'glob' )
const fs = require ( 'fs' )
const path = require ( 'path' )
const OUTFILE = path.resolve ( __dirname, '..', 'modules', 'Test', 'tests.ts' )
const outdir = path.dirname ( OUTFILE )

const posixdir = __dirname.replace ( /\\/g, '/')
const globpath = posixdir + '/../{desktop,modules}{,/**}/*.spec.*'
console.log ( `==== Finding all test files with  =====`)
console.log ( globpath )
console.log ( `=======================================` )
glob
( globpath
, {}
, function ( err, list ) {
    // make relative path
    const tests = list.map
    ( ( f ) => {
        const relpath = path.relative ( outdir, f ).replace ( /\\/g, '/' )
        console.log ( relpath )
        return `import '${ relpath }'`
      }
    )
    fs.writeFile
    ( OUTFILE, tests.join ( '\n' ), ( err ) => {
         if ( err ) throw ( err )
         console.log ( '' )
         console.log ( `'${OUTFILE}' DONE.` )
      }
    )
  }
)
