import { Component } from './Component'
import { describe } from '../modules/Test/runner'

const e = ( sel: string, klass?: string, obj?: any ) => {
  const o: any = Object.assign
  ( { sel , data: {}, children: [] }, obj || {} )

  if ( klass ) {
    o.data.class = { [klass]: true }
  }
  return o
}

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
        , e ( 'foo' )
        )
      }
    )

    it ( 'should accept class string', ( assert ) => {
        assert.equal
        ( <div class='foo bar'></div>
        , { sel: 'div'
          , data:
            { class: { foo: true, bar: true }
            }
          , children: []
          }
        )
      }
    )

    it ( 'should accept style string', ( assert ) => {
        assert.equal
        ( <div style='color:#555'></div>
        , { sel: 'div'
          , data:
            { style: { color: '#555' }
            }
          , children: []
          }
        )
      }
    )

    it ( 'should accept mixed children', ( assert ) => {
        assert.equal
        ( <ol>{ [ <li class='one'></li>, <li class='two'></li> ]}<li class='three'></li>{[ <li class='four'></li> ]}</ol>
        , { sel: 'ol'
          , data: {}
          , children:
            [ e ( 'li', 'one' )
            , e ( 'li', 'two' )
            , e ( 'li', 'three' )
            , e ( 'li', 'four' )
            ]
          }
        )
      }
    )

    it ( 'should move data-xx in props', ( assert ) => {
        assert.equal
        ( <foo data-bing='top'></foo>
        , { sel: 'foo'
          , data: { props: { ['data-bing']: 'top' }}
          , children: []
          }
        )
      }
    )

    it ( 'should optimize through key', ( assert ) => {
        const Foo = Component
        ( {}, ( {} ) => <div></div> )
        const a = <Foo key='bar'/>
        const b = <Foo key='bar'/>
        const c = <Foo key='bing'/>
        const d = <Foo/>

        assert.same ( a, b )
        assert.notSame ( a, c )
        assert.notSame ( a, d )
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

    it ( 'should parse hooks in sub components', ( assert ) => {
      const SubComp = ( opts ) => opts
        assert.equal
        ( <foo><SubComp foo='hop' on-change='bang'/></foo>
        , { sel: 'foo'
          , data: {}
          , children:
            [ { on: { change: 'bang' }
              , foo: 'hop'
              }
            ]
          }
        )
      }
    )

    it ( 'should wrap svg without attrs', ( assert ) => {
        const ns = 'http://www.w3.org/2000/svg'
        assert.equal
        ( <svg><foo bing='top'></foo></svg>
        , { sel: 'svg'
          , data: { ns, attrs: {} }
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

    it ( 'should wrap svg with attrs', ( assert ) => {
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
        , [ e ( 'li', null, { children: [ { text: 'a' } ] } )
          , e ( 'li', null, { children: [ { text: 'b' } ] } )
          ]
        )
      }
    )

    it ( 'should allow rows.map with mixed', ( assert ) => {
        const rows = ['a', 'b']
        const rmap = ( r ) => <li>{ r }</li>
        assert.equal
        ( ( <ul><li>foo</li>{ rows.map ( rmap ) }</ul> ).children
        , [ e ( 'li', null, { children: [ { text: 'foo' } ] } )
          , e ( 'li', null, { children: [ { text: 'a' } ] } )
          , e ( 'li', null, { children: [ { text: 'b' } ] } )
          ]
        )
      }
    )

  }
)
