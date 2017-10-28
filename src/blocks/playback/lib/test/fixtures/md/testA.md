# Test Project A

This is a simple test project.

## Setup

The graph below does this:

```
root
  add
    foo
    value
    value
```

When defining a target, we can either use '@' (named based target) or '$' (id based target). Visually, when a block is replaced by a branch (like @foo above), we display the name with brackets like this `[foo]`.

```yaml
# type: branch
# Name of the location to connect this branch
branch: root
entry: addid
nodes:
  addid:
    - fooid
    - value1id 
    - value2id
blocks:
  addid:
    name: add
    lang: ts
  fooid:
    name: foo
    lang: ts
  value1id:
    name: value
    lang: ts
  value2id:
    name: value
    lang: ts
```

## Default values

Here we change some elements to see how fragments are resolved.

### @value.main

This will change **all** fragments named 'main' in blocks named 'value'.

```ts
const v = 2
```

And then another paragraph with more details...

```ts
return v
```

# Appendix

This part is automatically added by the editor to store sources of all blocks in all graphs in the project. These are the contents of the block 'templates' that we drag into the graph. When we serialise to the filesystem, these end up in their own files.

## $addid.source

```ts
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
, children:
  [ '(): number', '(): number', '(): number' ]
}
```

### $fooid.source

```ts
import { Meta, Update } from 'lucidity'

export const update: Update =
(): number => {
  return 0
}

export const meta: Meta =
{ description: "Return a number."
, tags: [ 'test', 'value' ]
, author: 'Gaspard Bucher <gaspard@lucidity.io>'
, origin: 'lucidity.io/value'
, version: '1.0'
, update: '(): number'
}
```

### $value1id.source

```ts
import { Meta, Update } from 'lucidity'

export const update: Update =
(): number => {
  // <frag:main>
  return 0
  // </frag:main>
}

export const meta: Meta =
{ description: "Return a number."
, tags: [ 'test', 'value' ]
, author: 'Gaspard Bucher <gaspard@lucidity.io>'
, origin: 'lucidity.io/value'
, version: '1.0'
, update: '(): number'
}
```

### $value2id.source

```ts
import { Meta, Update } from 'lucidity'

export const update: Update =
(): number => {
  // <frag:main>
  return 0
  // </frag:main>
}

export const meta: Meta =
{ description: "Return a number."
, tags: [ 'test', 'value' ]
, author: 'Gaspard Bucher <gaspard@lucidity.io>'
, origin: 'lucidity.io/value'
, version: '1.0'
, update: '(): number'
}
```