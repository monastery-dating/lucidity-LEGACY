# Compilation

Compilation is done in five steps which are described in detail below.

## 1. Build tree

This simply returns the root of the tree. Not sure why we need this step.

A tree (same as Branch) is defined as:

```ts
interface BranchDefinition {
  // @name of the location to connect this branch
  branch: string
  // Root of this branch (where to start)
  entry: string
  nodes: StringMap < string [] >
}
```

Here is an example:

```yaml
# Name of the location to connect this branch
branch: root
entry: addid
nodes:
  addid:
    - fooid
    - value1id 
    - value2id
```

And then the Project contains blockById to map ids to actual blocks and
node fragments to replace parts of code in the block sources with other code.

## 2. Update sources

This step walks through every block in the project and resolves the fragments to produce a map of blockId -> Source.

A Source is simply defined as:

```ts
interface Source {
  lang: string
  source: string
}
```

## 3. Compile tree

Takes a branch and compiles it to a CompiledTree which is simply a mapping of node ids to CompiledNode defined as:

```ts
interface Block {
  init?: Init
  update?: Update
  meta?: Meta
}

interface CompiledBlock extends Block {
  js: string
}
```

## 4. Link tree

Takes a branch with compiled nodes and returns a linked tree which simply has a main function and a mapping to linked nodes.

```ts
interface LinkedTree {
  main (): void
  linkedNodes: StringMap < LinkedNode >
}
// WIth 
interface LinkedNode extends CompiledNode {
  helpers: Helpers
}
interface Helpers {
  asset?: Asset
  cache: Cache
  children: Children
  context: Context
  contextForChildren: Context
  control?: Control
  detached?: boolean
  require?: Require
}
```

The linking process takes branch definition and ???

# DISPLAY

We can display unlinked nodes