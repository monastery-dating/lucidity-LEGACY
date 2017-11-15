import { LinkedTree, Project, Program } from './types'
import { compile, buildSources } from './compile'
import { parse } from './parse'

import { source } from './test'

const project = parse ( source ( 'testA.md' ) )

const VALUE1_SOURCE =
`import { Meta, Update } from 'lucidity'

export const update: Update =
(): number => {
  // <frag:main>
const v = 2
return v
  // </frag:main>
}

export const meta: Meta =
{ description: "Return a number."
, tags: [ 'test', 'value' ]
, author: 'Gaspard Bucher <gaspard@lucidity.io>'
, origin: 'lucidity.io/value'
, version: '1.0'
, update: '(): number'
}`

describe ( 'compile', () => {
  it ( 'should compile Project to Program', () => {
    const program = compile ( project )

    expect
    ( program.linkedNodes [ 'addid' ].helpers.cache.result.value
    )
    .toEqual ( 0 )

    program.main ()

    expect
    ( program.linkedNodes [ 'addid' ].helpers.cache.result.value
    )
    .toEqual ( 4 )
  })
})

describe ( 'updateSources', () => {
  it ( 'should return changed sources in Project', () => {
    const sources = buildSources ( project )
    expect
    ( sources [ 'value1id' ]
    )
    .toEqual ( { source: VALUE1_SOURCE, lang: 'ts' } )
  })
})