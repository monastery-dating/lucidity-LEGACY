import { parse } from './parse'

import { readFileSync } from 'fs'
import * as path from 'path'

// Path has to be relative to compile ts file...
declare var __dirname: any
const TXT = readFileSync ( path.join ( __dirname, 'test/testA.md' ), 'utf8' )

describe ( 'parse', () => {
  it ( 'should parse markdown', () => {
    const x = parse ( TXT )
    Object.keys ( x.targets )
    .forEach
    ( key => {
      console.log ( key )
      console.log ( x.targets [ key ].sources.join ( '\n' ) )
    })
  })
})