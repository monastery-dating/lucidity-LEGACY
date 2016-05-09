import { Component } from './Component'
import { describe } from '../modules/Test/runner'

const e = ( obj ) => Object.assign ( { sel: 'div', data: {}, children: [] }, obj )

describe
( 'Component.createElement', ( it ) => {
    it ( 'should be a function', ( assert ) => {
        assert.equal
        ( typeof Component.createElement
        , 'function'
        )
      }
    )

    it ( 'should create simple object', ( assert ) => {
        assert.equal
        ( <foo></foo>
        , e ( { sel: 'foo' } )
        )
      }
    )

    it ( 'should wrap props', ( assert ) => {
        assert.equal
        ( <foo bing='top'></foo>
        , { sel: 'foo'
          , data: { props: { bing: 'top' }}
          , children: []
          }
        )
      }
    )

    it ( 'should wrap attrs in svg', ( assert ) => {
        const ns = 'http://www.w3.org/2000/svg'
        assert.equal
        ( <svg width='10'><foo bing='top'></foo></svg>
        , { sel: 'svg'
          , data: { ns, attrs: { width: '10' } }
          , children:
            [ { sel: 'foo'
              , data: { ns, attrs: { bing: 'top' } }
              , children: []
              }
            ]
          }
        )
      }
    )

    it ( 'should allow rows.map', ( assert ) => {
        const rows = ['a', 'b']
        const rmap = ( r ) => <li>{ r }</li>
        assert.equal
        ( ( <ul>{ rows.map ( rmap ) }</ul> ).children
        , [ e ( { sel: 'li', children: [ { text: 'a' } ] } )
          , e ( { sel: 'li', children: [ { text: 'b' } ] } )
          ]
        )
      }
    )
  }
)
