import { GraphAction } from '../workbench/graph/graph.mutations'
import { FilesAction } from '../workbench/files/files.mutations'

export type Action = FilesAction | GraphAction
