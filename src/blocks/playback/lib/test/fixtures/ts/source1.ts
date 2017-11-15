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
  // <main>
  result.value = child1 () + child2 () + child3 ()
  // </main>
}

export const meta: Meta =
{ author: 'Gaspard Bucher <gaspard@lucidity.io>'
, children:
[ '(): number', '(): number', '(): number' ]
, description: "Compute sum of three numbers."
, expect: { test: 'test.Result' }
, origin: 'lucidity.io/value'
, tags: [ 'test', 'add' ]
, update: '(): void'
, version: '1.0'
}