import { Init, Update, Meta } from 'lucidity'

let test = { value: '' }

export const init: Init =
( { context } ) => {
  test = context.test
}

export const update: Update =
(): void => {
  // <frag:main>
  test.value = 'Hello Lucidity'
  // </frag:main>
}

export const meta: Meta =
{ children: []
, expect: { test: 'test.Result' }
, update: '(): void'
}
