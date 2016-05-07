import { GraphAction } from '../workbench/graph/graph.mutations'
import { FilesAction } from '../workbench/files/files.mutations'
import { LibraryAction } from '../library/library.mutations'

export type Action = FilesAction
                   | GraphAction
                   | LibraryAction
