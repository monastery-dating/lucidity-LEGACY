import { Project, Program } from './types'
import { compile, updateSources } from './compile'
import { parse } from './parse'

import { projectMarkdown } from './test/test-util'

const project = parse ( projectMarkdown ( 'testA' ) )

const VALUE1_SOURCE =
`export const update: Update =
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
    // program.init ()
    // program.update ()
    // expect
    // ( program.cache [ '$addid' ].result.value
    // )
    // .toEqual ( 6 )
  })
})

describe ( 'updateSources', () => {
  it ( 'should return changed sources in Project', () => {
    const cache = {}
    const sources = updateSources ( cache, project )
    expect
    ( sources [ 'value1id' ]
    )
    .toEqual ( VALUE1_SOURCE )
  })
})