import { GraphType } from '../common/graph.type'

export const nextGraphId = function
( graph : GraphType
) : string {
  let n : number = 0
  while ( graph [ `id${n}` ] ) {
    n += 1
  }
  return `id${n}`
}

export const rootGraphId = nextGraphId ( {} )
