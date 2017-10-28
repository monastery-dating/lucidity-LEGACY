# Composition, Markdown, Compiler: how do these interact ?

I would say we have:

## Composition --> Markdown

But what about sources ? Does the editor always use "Annexe" ? Could be.

## Markdown --> Composition

We parse everything, including annexe and put the relevant parts in custom
tags or text. Missing custom tags raise errors.

Markdown is used when we do copy/paste and to save bits of code (for reuse or
sharing). Having a storage that is well specified helps avoid the "changing
details" of the editor or the compiler.

## Markdown --> Composition --> Compiler

The compiler (only) understands the Composition format and this is what is used to create the runtime graph.

## Composition [changes] --> Compiler

The change operations are also understood by the compiler to recompile only the required parts. This means that changes to code or any specific paragraph should go through the editor's own API, eventually by simply calling:

```ts
changeParagraph ( path, para, keyPath, value )
// This ends up as set ( `${ path }.data.${ para }.${ keyPath }`, value )
// but it is also used for precise compiler updates.
```
