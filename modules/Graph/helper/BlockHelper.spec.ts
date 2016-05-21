import { describe } from '../../Test/runner'
import { BlockType, BlockByIdType } from '../types'
import { BlockHelper } from './BlockHelper'

const SOURCE_A = ``

describe ( 'BlockHelper.create', ( it ) => {

    it ( 'should new _id', ( assert ) => {
        const node = BlockHelper.create ( 'hello' , SOURCE_A )
        assert.equal
        ( typeof node._id
        , 'string'
        )
      }
    )

    it ( 'should set name', ( assert ) => {
        const node = BlockHelper.create ( 'hello' , SOURCE_A )
        assert.equal
        ( node.name
        , 'hello'
        )
      }
    )

    it ( 'should set source', ( assert ) => {
        const node = BlockHelper.create ( 'hello' , SOURCE_A )
        assert.equal
        ( node.source
        , SOURCE_A
        )
      }
    )

    it ( 'should be immutable', ( assert ) => {
        const node = BlockHelper.create ( 'hello' , SOURCE_A )
        assert.throws
        ( function () {
          node.name = 'foobar'
          }
        )
      }
    )

    it ( 'should parse source', ( assert ) => {
        const node = BlockHelper.create ( 'hello' , SOURCE_A )
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

describe ( 'BlockHelper.update', ( it ) => {

    const node = BlockHelper.create ( 'hello' , SOURCE_A )

    it ( 'should set name', ( assert ) => {
        const node2 = BlockHelper.update ( node, { name: 'new name' } )
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
