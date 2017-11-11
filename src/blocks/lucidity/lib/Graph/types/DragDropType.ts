export interface Position {
  x: number
  y: number
}

interface DragArg {
  drag: {
    copy: boolean 
    nodeId: string
    nodePos: Position
    path: string
  }
}

interface MoveArg {
  move: {
    copy: boolean
    clientPos: Position
    target: string | null
  }
}

export interface DragDropCallbacks {
  drag ( drag: DragArg ): void
  drop (): void
  move ( arg: MoveArg ): void
}