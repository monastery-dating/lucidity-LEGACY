We actually have three types of things that deal with the project data:

- *UI*, *Storage* and *Playback*

# UI

On the UI side, we need to save anything that is required by the display.
This involves things that need to be saved with the project (branch definition,
code source, text, etc) but also stuff that is only required in a transient manner
(selected block, errors, drag & drop, etc).

In order to make it simple to serialize the document without needing complicated
parsing and serialization, we could store all *ui* stuff as:

```ts
// We just need to make sure path deletion in document is reflected in the $ui
// paths.
const uiPath = `$ui.${ path }`
```

# Playback

The playback needs to deal with a fast in-memory runtime that is easy to update and
for which we can receive compilation and other kinds of feedback. The playback
is not saved in the state tree.

Playback interaction happens through a Project class:

```ts
/** NEW PROJECT / DOCUMENT **/
// Nothing to store in the state tree for a new project.
const project = new Project
// The 'BranchDefinition' is stored in the state tree (storage)
// [ path ].branch = branch
const changes: Changes = project.newBranch ()
// Block saved with branch: ... branchId.blocks.blockId.[blockHere]
// [ path ].branch.blocks.[ block.id ] = block
const changes: Changes = project.newBlock ( branchId, parentId )
// etc

interface Changes {
  // UI changes are written to $ui.path.changePath
  // example:
  // path = data.document.[docId].composition
  // changePath = branch.blocks.b3.source
  ui: { 
    [ changePath: string ]: any 
  }
  // Storage changes are written to path.changePath
  storage { 
    [ changePath: string ]: any
  }
}
```

Do we want to handle multi-document projects ? Yes. Then we could have ui changes
that are related to items located in other documents. So we might need to find a
way to store these information somehow.

