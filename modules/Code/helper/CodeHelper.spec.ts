import { describe } from '../../Test'
import { CodeHelper } from './CodeHelper'

describe ( 'CodeHelper.scrubParse', ( it ) => {
  const source =
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
  const literals = []
  const scrubjs = CodeHelper.scrubParse
  ( source, literals )

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
