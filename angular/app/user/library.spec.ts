/// <reference path="../../typings/jasmine/jasmine.d.ts" />
// import { NodeType } from './node.type'
import { LibraryType } from './library.type'
import * as Node from '../types/node.helper'
import * as Library from './library.helper'

const basePath = '/some/place'

describe
( 'Library.create', () => {
    let library : LibraryType
    const node  = Node.create ( 'hello' , SOURCE_A, basePath )
    beforeEach
    ( () => {
        library = Library.create ( basePath )
      }
    )

    it ( 'should store path ref', () => {
        expect ( library.path )
        .toBe ( basePath )
      }
    )

    it ( 'should create empty nodes', () => {
        expect ( library.nodes )
        .toEqual ( [] )
      }
    )

    it ( 'should create empty nodesById', () => {
        expect ( library.nodesById )
        .toEqual ( {} )
      }
    )

    it ( 'should be immutable', () => {
        expect
        ( function () {
          library.nodesById['foo'] = node
          }
        )
        .toThrow ()
      }
    )
  }
)

describe
( 'Library.add', () => {
    let library : LibraryType
    const node  = Node.create ( 'hello' , SOURCE_A, basePath )
    beforeEach
    ( () => {
        library = Library.create ( basePath )
      }
    )

    it ( 'should create new object', () => {
        const l = Library.add ( library, node )
        expect ( l )
        .not.toBe ( library )
      }
    )

    it ( 'should add to nodes', () => {
        library = Library.add ( library, node )
        expect ( library.nodes )
        .toEqual ( [ 'id0' ] )
      }
    )

    it ( 'should keep nodes sorted by node name', () => {
        library = Library.add ( library, node  )
        const node2 = Node.create ( 'armin' , SOURCE_A, basePath )
        library = Library.add ( library, node2 )
        expect ( library.nodes )
        .toEqual ( [ 'id1', 'id0' ] )
      }
    )

    it ( 'should add to nodesById', () => {
        library = Library.add ( library, node )
        expect ( library.nodesById )
        .toEqual ( { id0: node } )
      }
    )
  }
)

describe
( 'Library.rename', () => {
    let library : LibraryType
    const foo = Node.create ( 'foo' , SOURCE_A, basePath )
    const bar = Node.create ( 'bar' , SOURCE_A, basePath )
    beforeEach
    ( () => {
        library = Library.create ( basePath )
        library = Library.add ( library, foo )
        library = Library.add ( library, bar )
      }
    )

    it ( 'should create new object', () => {
        const l = Library.rename ( library, 'id0', 'ama')
        expect ( l )
        .not.toBe ( library )
      }
    )

    it ( 'should keep nodes sorted by node name', () => {
        expect ( library.nodes )
        .toEqual ( [ 'id1', 'id0' ] )
        const l = Library.rename ( library, 'id0', 'ama')
        expect ( l.nodes )
        .toEqual ( [ 'id0', 'id1' ] )
      }
    )

    it ( 'should update nodesById', () => {
        const l = Library.rename ( library, 'id0' , 'ama')
        expect ( l.nodesById [ 'id0' ] )
        .not.toBe ( foo )
        expect ( l.nodesById [ 'id0' ].name )
        .toEqual ( 'ama' )
      }
    )
  }
)


const SOURCE_A = ``
