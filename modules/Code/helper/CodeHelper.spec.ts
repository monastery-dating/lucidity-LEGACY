import { describe } from '../../Test'
import { compileCode } from './CodeHelper'

describe ( 'compileCode', ( it ) => {

  it ( 'should return errors on invalid code', ( assert, done ) => {
    compileCode ( 'x', ( { js, errors } ) => {
      assert.same ( js, undefined )

      assert.equal
      ( { message: "Cannot find name 'x'.", line: 0, ch: 0 }
      , errors [ 0 ]
      )
    })

  })

  it ( 'should recognize lucidity', ( assert ) => {
    const src = "import { Meta } from 'lucidity'"
    compileCode ( src, ( { js, errors } ) => {
      assert.same ( errors, undefined )
      assert.equal ( js, '"use strict";\n' )
    })
  })

  it ( 'should recognize browser libs', ( assert ) => {
    const src = "window.boom()"
    compileCode ( src, ( { js, errors } ) => {
      assert.equal
      ( "Property 'boom' does not exist on type 'Window'."
      , errors [ 0 ].message
      )
    })
  })
})

describe ( 'compileCode scrub', ( it ) => {
  const src =
  `// This is a comment
   export const init =
   ( { context } ) => {
     context.test.a = 10
     context.test.b = -20
     context.test.x = x - 30
     context.test.y = - 40
     foo ( -  50 , 60 )
     const bar = { x: -70, y: [ - 80, 90, 100 - 110 ] }
   }

   export const update =
   () => {
     return 120
   }
  `

  compileCode ( src, ( { scrub } ) => {
    const literals = scrub.literals

    it ( 'should get values with unary minus', ( assert ) => {
      assert.equal
      ( literals.map ( l => l.value )
      , [10,-20,30,-40,-50,60,-70,-80,90,100,110,120]
      )
    })

    it ( 'should get literal position', ( assert ) => {
      assert.equal
      ( literals.map ( l => l.line )
      , [3,4,5,6,7,7,8,8,8,8,8,13]
      )
    })
  })
})
