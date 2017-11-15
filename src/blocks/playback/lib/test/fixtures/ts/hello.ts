import { Init, Update, Meta } from 'lucidity'

let test = { value: '' }

export const init: Init =
( { context } ) => {
  test = context.test
}

export const update: Update =
(): void => {
  // <main>
  test.value = 'Hello Lucidity'
  // </main>
}

export const meta: Meta =
{ expect: { test: 'test.Result' }
}
