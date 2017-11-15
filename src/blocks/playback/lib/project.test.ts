import { newProject, LiveProject } from './project'
import { source } from './test'
import { uimap } from 'blocks/lucidity/lib/Graph/helper/uimap';

it ( 'should create new project', () => {
  expect
  ( newProject ()
  ).toBeInstanceOf
  ( LiveProject
  )
})

it ( 'should receive base context', () => {
  const project = newProject ()
  project.setContext ( 'foo', 'foo.type', 'foo value' )
  expect
  ( project.context [ 'foo' ]
  ).toEqual ( 'foo value' )
  expect
  ( project.provide [ 'foo' ]
  ).toEqual ( 'foo.type' )
})

describe ( 'runtime', () => {
  let project: LiveProject
  let test: any
  beforeEach ( () => {
    project = newProject ()
    test = {}
    project.setContext ( 'test', 'test.Result', test )
  })

  it ( 'should compile on addBranch', () => {
    const branch = project.newBranch ()
    const block = project.newBlock ( branch.id, branch.entry )
    const src = source ( 'hello.ts' )
    project.setBlockSource ( block.id, src )
    expect
    ( block.source ).toEqual
    ( src )
    expect
    ( test.value ).toEqual
    ( 'Hello Lucidity' )
  })
  
  it ( 'should uimap branch', () => {
    const branch = project.newBranch ()
    const block = project.newBlock ( branch.id, branch.entry )
    const src = source ( 'hello.ts' )
    project.setBlockSource ( block.id, src )
    const uigraph = uimap ( branch )
  })
})
