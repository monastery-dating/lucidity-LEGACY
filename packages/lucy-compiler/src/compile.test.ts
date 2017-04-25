import { Project, Program } from './types'
import { compile, updateSources } from './compile'
import { parse } from './parse'

import { projectMarkdown } from './test/test-util'

const project = parse ( projectMarkdown ( 'testA' ) )

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
    // expect
    // ( sources [ 'value1id' ]
    // )
    // .toEqual ( '' )
  })
})