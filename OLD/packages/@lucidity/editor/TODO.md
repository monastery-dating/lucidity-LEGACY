# Better API

Use cases:

## API MarkdownEditor

```ts
import { markdownEditor } from 'lucy-editor'
import { connect } from 'cerebral/react'

const Editor = markdownEditor ( { connect } )

export default connect
( { markdown: state`editor.markdown`
  , onChanged: signal`editor.markdownChanged`
  }
, function TextThing
  ( { markdown, changed } ) {
    return <Editor markdown={ markdown } onChange={ onChange } />
  }
)

```

## API with custom blocks

```ts
import { markdownEditor } from 'lucy-editor'
import { connect } from 'cerebral/react'

const Editor = markdownEditor
( { connect 
  , blocks:
    // { t: 'img', o: ... } ==> <Image options=... />
    // to markdown will create a yaml block with
    // ```yaml
    // lucyEditor: 'img'
    // href: 'foo'
    // ```
    { img:
      { icon: 'fa-image' // display when empty paragraph in toolbox
      , tag: Image
      }
    }
  }
)

export default connect
( { markdown: state`editor.markdown`
  , onChanged: signal`editor.markdownChanged`
  }
, function TextThing
  ( { markdown, changed } ) {
    return <Editor markdown={ markdown } onChange={ onChange } />
  }
)
```

## API for large articles

```ts
import { cerebralEditor } from 'lucy-editor'
import { connect } from 'cerebral/react'

const Editor = cerebralEditor
( { connect 
  , blocks:
    // { t: 'img', o: ... } ==> <Image options=... />
    // to markdown will create a yaml block with
    // ```yaml
    // lucyEditor: 'img'
    // href: 'foo'
    // ```
    { img:
      { icon: 'fa-image' // display when empty paragraph in toolbox
      , tag: Image
      }
    }
  }
)

export default connect
( { onChange: signal`editor.processOps`
  }
, function TextThing
  ( { markdown, onChange } ) {
    return <Editor basePath={ 'some.path' } onChange={ onChange } />
  }
)
```

And the changes handler looks like the current 'processOps' function...

Extra methods if needed to conver whole article to/from Markdown. These
are used in signals to save/open articles:

```ts
import { toMarkdown, fromMarkdown } from 'lucy-editor'
const md = toMarkdown ( state.get ( 'some.path' ) )
const editorState = fromMarkdown ( 'some text' )
```


# LateX ?

Enable LateX math by parsing $...$ inline and using special Latex block.

# Use sibling pointer ?

Could we get rid of ordering and simply using a sibling pointer ? This would make the code a lot cleaner but then some operations become more
complex:

In a structure like this: [ a, b, (x), c, d ]

### With a sibling pointer:

delete a -> [ delete:a, update:parent.child ]
delete b -> [ delete:b, update:a ]
update b -> [ update:b ]
insert x -> [ insert:x, update:b ]

### With numbers and sorting

delete a -> [ delete:a ]
delete b -> [ delete:b ]
update b -> [ update:b ]
insert x -> [ insert:x ]

## What about stability in case of collaborative edit ?

Numbers and sorting is more stable. Let's say with these two edits and we
do not know in which order they will arrive at the database:

    user A: insert x
    user B: update b
    
With sibling:

    user A: [ insert:x, update:b ]
    user B: [ update:b ]

    => reconciliation breaks with sibling

With numbers:

    user A: [ insert:x ]
    user B: [ update:b ]