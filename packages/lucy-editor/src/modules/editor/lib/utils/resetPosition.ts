import { PositionedElementsType } from './types'
export function resetPosition
( children: PositionedElementsType
): PositionedElementsType {
  const result: PositionedElementsType = {}
  let p = 0
  Object.keys
  ( children ).sort
  ( (a, b) => children [ a ].p - children [ b ].p ).forEach
  ( ref => {
      result[ref] = Object.assign({}, children[ref], {p})
      p += 1
    }
  )
  return result
}


interface Foo {
  t: string
  s: string
}

interface Bar {
  t: string
  i: { [ key: string ]: string } 
}

type Foobar = Foo | Bar

function foo ( f: Foo ) {

}

function isFoo
( f: Foo | Bar
): f is Foo {
  return (<Foo>f).hasOwnProperty ( 's' )
}

function foobar ( f: Foobar ) {
  if ( isFoo ( f ) ) {
    foo ( f )
  }
}