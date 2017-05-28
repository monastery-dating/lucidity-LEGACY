const path = require ( 'path' )
const fs = require ( 'fs' )

const fullpath =
path.join ( __dirname, './lib/index.js' )

// This is how we would include sub-paths
// 'lucidity/utils': 'node_modules/lucidity/src/utils.ts'
const imports =
{ 'lucidity': 'node_modules/lucidity/src/index.ts'
, 'lib.d': 'node_modules/typescript/lib/lib.es6.d.ts'
}

const definitions =
Object.keys ( imports ).reduce
( ( acc, key ) => {
    acc [ key ] = fs.readFileSync
      ( path.join ( __dirname, imports [ key ] ), 'utf-8' )
    return acc
  }
, {}
)

fs.writeFileSync
( fullpath
, `module.exports = ${ JSON.stringify ( { definitions }, null, 2 ) }`
)

console.log ( `\nWrote definitions to '${ fullpath }'.\n`)

