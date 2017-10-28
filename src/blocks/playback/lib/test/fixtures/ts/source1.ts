import { Init, Update, Meta } from 'lucidity'
let result = { value: 0 }
let child1: Update
let child2: Update
let child3: Update

export const init: Init =
( { cache, children } ) => {
  if ( ! cache.result ) {
    cache.result = { value: 0 }
  }
  result = cache.result

  child1 = children [ 0 ]
  child2 = children [ 1 ]
  child3 = children [ 2 ]
}

export const update: Update =
(): void => {
  // <frag:main>
  result.value = child1 () + child2 () + child3 ()
  // </frag:main>
}

export const meta: Meta =
{ description: "Compute sum of three numbers."
, tags: [ 'test', 'add' ]
, author: 'Gaspard Bucher <gaspard@lucidity.io>'
, origin: 'lucidity.io/value'
, version: '1.0'
, update: '(): void'
, children:
  [ '(): number', '(): number', '(): number' ]
}