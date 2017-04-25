import { Project, Program } from './types'
import { compile } from './compile'
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