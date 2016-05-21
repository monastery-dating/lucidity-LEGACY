import { describe } from '../../Test/runner'
import { BlockType, BlockByIdType } from '../types'
import { Block } from './Block'

const SOURCE_A = ``
const basePath = '/some/place'

describe ( 'Block.create', ( it ) => {

    it ( 'should set name', ( assert ) => {
        const node = Block.create ( 'hello' , SOURCE_A, basePath )
        assert.equal
        ( node.name
        , 'hello'
        )
      }
    )

    it ( 'should set source', ( assert ) => {
        const node = Block.create ( 'hello' , SOURCE_A, basePath )
        assert.equal
        ( node.source
        , SOURCE_A
        )
      }
    )

    it ( 'should compute path', ( assert ) => {
        const node = Block.create ( 'hello' , SOURCE_A, basePath )
        assert.equal
        ( node.path
        , `${basePath}/hello.ts`
        )
      }
    )

    it ( 'should be immutable', ( assert ) => {
        const node = Block.create ( 'hello' , SOURCE_A, basePath )
        assert.throws
        ( function () {
          node.name = 'foobar'
          }
        )
      }
    )

    it ( 'should parse source', ( assert ) => {
        const node = Block.create ( 'hello' , SOURCE_A, basePath )
        assert.pending ( 'should parse source' )
        assert.equal
        ( node.input
        , [ 'text:string', 'text:string' ]
        )
        assert.equal
        ( node.output
        , 'text:string'
        )
        assert.same
        ( node.init
        , false
        )
      }
    )
  }
)

describe ( 'Block.update', ( it ) => {

    const node = Block.create ( 'hello' , SOURCE_A, basePath )

    it ( 'should set name', ( assert ) => {
        const node2 = Block.update ( node, { name: 'new name' } )
        assert.equal
        ( node.name
        , 'hello'
        )
      }
    )

    it ( 'should set source', ( assert ) => {
        assert.equal
        ( node.source
        , SOURCE_A
        )
      }
    )

    it ( 'should compute path', ( assert ) => {
        assert.equal
        ( node.path
        , `${basePath}/hello.ts`
        )
      }
    )

    it ( 'should parse source', ( assert ) => {
        assert.pending ( 'should parse source' )
        assert.equal
        ( node.input
        , [ 'text:string', 'text:string' ]
        )
        assert.equal
        ( node.output
        , 'text:string'
        )
        assert.same
        ( node.init
        , false
        )
      }
    )
  }
)

describe ( 'Block.nextBlockId', ( it ) => {
    it ( 'should return id0 on empty map', ( assert ) => {
        assert.equal
        ( Block.nextNodeId ( {} )
        , 'id0'
        )
      }
    )

    it ( 'should return first free in graph', ( assert ) => {
        const n = Block.create ( 'foo', '', '' )
        assert.equal
        ( Block.nextNodeId ( <BlockByIdType> { id0: n, id3: n } )
        , 'id1'
        )
      }
    )
  }
)
