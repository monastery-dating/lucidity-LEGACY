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

  const lit = []
  CodeHelper.scrubParse ( "import { Init, Update, Meta } from '../types/lucidity' // and this goes beyond...\n\n// THis is ok\nexport const init: Init =\n( { context, control, cache, detached } ) => {\n  const position = context.object3d.position\n  \n  const x = -1\n  position.x = x\n  position.y = 1\n  position.z = -3\n  \n  if ( detached ) {\n    position.x = 0\n  }\n}\n\nconst PI2 = Math.PI * 2\n\nexport const meta: Meta =\n{ description: \"Move the current 3D object along x axis.\"\n, tags: [ '3D' , 'three.js', 'position', 'x' ]\n, author: 'Gaspard Bucher <gaspard@lucidity.io>'\n, origin: 'lucidity.io/three.Rotation.x'\n, version: '1.0'\n, expect: { object3d: 'THREE.Object3D' }\n}\n\n// hello ?\n// what", lit )
  console.log ( lit )

  it ( 'should get literal position', ( assert ) => {
    assert.equal
    ( literals.map ( l => l.line )
    , [3,4,5,6,7,7,8,8,8,8,8,13]
    )
  })

})
