'use strict'
const path = require ( 'path' )
const fs = require ( 'fs' )
const execSync = require ( 'child_process' ).execSync
const ROOT = path.resolve ( __dirname, '..' )
const BUILD = path.resolve ( ROOT , 'app', 'build' )

const stat =
( filepath
) => {
  try {
    return fs.statSync ( filepath )
  }
  catch ( err ) {
    return null
  }
}

const copy =
( source
, targetdir
) => {
  const sourceStat = stat ( source )
  if ( !sourceStat ) {
    throw `Cannot copy '${source}' (does not exist).`
  }
  const targetdirStat = stat ( targetdir )
  if ( !targetdirStat ) {
    fs.mkdirSync ( targetdir )
  }
  else if ( !targetdirStat.isDirectory () ) {
    throw `Cannot copy to target '${targetdir}' (is not a directory).`
  }

  if ( sourceStat.isDirectory () ) {
    // copy -r ?
    throw `Copy directory not implemented yet.`
  }

  const basename = path.basename ( source )
  const target = path.resolve ( targetdir, basename )

  const targetStat = stat ( target )
  if ( targetStat && !targetStat.isFile () ) {
    throw `Cannot copy to '${target}' (not a file).`
  }

  // copy
  console.log ( '[copy] ' + source + ' ' + target )
  fs.createReadStream ( source )
  .pipe
  ( fs.createWriteStream ( target ) )
}

const inDir =
( paths
, callback
) => {
  if ( !Array.isArray ( paths ) ) {
    paths = [ paths ]
  }
  let dirpath = ''
  for ( let i = 0; i < paths.length; ++i ) {
    dirpath = path.resolve ( dirpath, paths [ i ] )
    const dirStat = stat ( dirpath )
    if ( !dirStat ) {
      fs.mkdirSync ( dirpath )
    }
    else if ( !dirStat.isDirectory () ) {
      throw `Cannot work in directory '${dirpath}' (not a directory).`
    }
  }

  const base = process.cwd ()
  process.chdir ( dirpath )
  callback ()
  process.chdir ( base )
}

const execute = function
( /* ...args */ ) {
  const args = Array.from ( arguments )
  const command = args.join ( ' ' )
  console.log ( '[exec] ' + command )
  execSync ( command, ( error, stdout, stderr ) => {
    if ( error ) {
      throw error
    }
    console.log ( stderr )
    console.log ( stdout )
  })
}

// =================================================== BUILD

// =========== lua
const BUILD_LUA = path.resolve ( BUILD, 'lua' )
const BUILD_LUA_CPATH = path.resolve ( BUILD_LUA, 'lib', 'lua', '5.1' )

// torch
const tmpdir = path.resolve ( __dirname, '..', 'tmp' )
const torchdir = path.resolve ( tmpdir, 'luajit-rocks' )
inDir ( tmpdir, () => {
  if ( stat ( torchdir ) ) {
    inDir ( torchdir, () => {
      execute ( 'git', 'pull' )
    })
  }
  else {
    execute ( 'git', 'clone', '--depth=1', 'https://github.com/torch/luajit-rocks.git' )
  }
  inDir ( [ torchdir, 'build' ], () => {
    execute ( 'cmake', '..', `-DCMAKE_INSTALL_PREFIX=${BUILD_LUA}` )
    execute ( 'make', 'install' )
  })
})

// boot.lua
copy ( path.resolve ( ROOT, 'boot', 'boot.lua' ), BUILD_LUA )
// lucidity.lua
copy ( path.resolve ( ROOT, 'modules', 'Playback', 'process', 'lucidity.lua' ), BUILD_LUA )

// rapidjson
if ( ! stat ( path.resolve ( BUILD_LUA_CPATH, 'rapidjson.so' ) ) ) {
  execute ( path.resolve ( BUILD_LUA, 'bin', 'luarocks' ), 'install', 'rapidjson' )
}
else {
  console.log ( '[skip] ' + 'rapidjson.so (already installed)')
}
