import { DragDropCallbacks, NodeType, Position, UINodeType } from '../../Graph/types'

interface ClickCallback {
  ( e: React.MouseEvent<SVGElement> ): void
}

interface DragCallback {
  ( pos: Position, copy: boolean ): string
}

const MIN_DRAG_DIST = 4 // manhattan distance to trigger a drag
const MIN_SLOT_DIST = Math.pow ( 140, 2 )

interface SlotInfo {
  // client position
  x: number
  y: number
  // info for drag op
  target: string
}

const startDrag =
( callbacks: DragDropCallbacks
, initTarget: string
) => {
  const start = Date.now ()
  const doc = document.documentElement
  const slots: SlotInfo[] = []
  const list = document.getElementsByClassName ( 'sclick' )
  let skipTarget: string | null = initTarget

  for ( let i = 0; i < list.length; ++i ) {
    const s = list [ i ]
    const r = s.getBoundingClientRect ()
    const target = s.getAttribute ( 'data-drop' )
    if ( target ) {
      slots.push
      ( { x: r.left
        , y: r.top
        , target
        }
      )
    }
  }

  // mouse move detected document wide
  const mousemove = ( e : MouseEvent ) => {
    e.preventDefault ()
    const x = e.clientX
    const y = e.clientY
    const clientPos = { x, y }
    // Find closest slot.
    let d: number = MIN_SLOT_DIST
    let target: string | null = null
    let m: SlotInfo
    for ( const s of slots ) {
      const dx = s.x - x
      const dy = s.y - y
      const ds = dx * dx + dy * dy
      if ( ds < d ) {
        m = s
        d = ds
        target = s.target
      }
    }
    if ( target === skipTarget && Date.now () < start + 800 ) {
      // ignore
      target = null
    }
    else {
      skipTarget = null
    }

    callbacks.move
    ( { move: { target, clientPos, copy: e.altKey } } )
  }

  const mouseup = ( e: MouseEvent ) => {
    e.stopPropagation ()
    e.preventDefault ()

    doc.removeEventListener ( 'mousemove', mousemove )
    doc.removeEventListener ( 'mouseup', mouseup )

    callbacks.drop ()
  }

  doc.addEventListener ( 'mousemove', mousemove )
  doc.addEventListener ( 'mouseup', mouseup )
}

export module DragDropHelper {
  export const drag =
  ( callbacks: DragDropCallbacks
  , dragclbk: DragCallback
  , clickClbk: ClickCallback
  ) => {
    let evstate: 'down' | 'dragging' | 'up' = 'up'
    let clickpos: Position
    let nodePos: Position

    const mouseup = ( e: React.MouseEvent<SVGElement> ) => {
      e.preventDefault ()
      // Do not stopPropagation here or we miss drag release.

      if ( evstate === 'down' ) {
        // Only handle simple click here. The drop operation happens in
        // docup.
        clickClbk ( e )
      }

      evstate = 'up'
    }

    const mousedown = ( e: React.MouseEvent< SVGElement > ) => {
      e.stopPropagation ()
      e.preventDefault ()
      const target = e.target as HTMLElement
      const rect = target.getBoundingClientRect ()
      clickpos = { x: e.clientX, y: e.clientY }
      nodePos = { x: e.pageX - rect.left
                , y: e.pageY - rect.top
                }
      evstate = 'down'
    }


    // mouse move on element (just used to trigger drag)
    const mousemove = ( e : React.MouseEvent< SVGElement > ) => {
      e.preventDefault ()

      const clientPos = { x: e.clientX, y: e.clientY }

      if ( evstate === 'down' ) {
        if ( Math.abs ( clientPos.x - clickpos.x )
           + Math.abs ( clientPos.y - clickpos.y ) < MIN_DRAG_DIST ) {
          return
        }
        evstate = 'dragging'

        const initTarget = dragclbk ( nodePos, e.altKey )

        // FIXME: How can we wait for after DOM update ?
        setTimeout
        ( () => {
            startDrag ( callbacks, initTarget )
          }
        , 80
        )
      }
    }

    const click = ( e: React.MouseEvent<SVGElement> ) => {
      e.preventDefault ()
      e.stopPropagation ()
    }

    return { click, mousedown, mousemove, mouseup }
  }
}
