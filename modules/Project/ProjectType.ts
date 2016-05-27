import { GraphType } from '../Graph'

export interface ProjectType {
  _id: string
  _rev?: string
  name: string
  // scene ids
  scenes: string[]
  // project graph
  graph: GraphType
}
