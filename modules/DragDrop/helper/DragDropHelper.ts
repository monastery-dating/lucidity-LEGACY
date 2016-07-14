import { SignalsType } from '../../context.type'
import { NodeType, UINodeType } from '../../Graph'

interface ClickCallback {
  ( e: MouseEvent ): void
}

interface Position {
  x: number
  y: number
}

interface DragCallback {
  ( pos: Position, copy: boolean ): void
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

const startDrag = ( signals: SignalsType ) => {
  const doc = document.documentElement
  const slots: SlotInfo[] = []
  const list = document.getElementsByClassName ( 'sclick' )

  for ( let i = 0; i < list.length; ++i ) {
    const s = list [ i ]
    const r = s.getBoundingClientRect ()
    const target = s.getAttribute ( 'data-drop' )
    slots.push
    ( { x: r.left
      , y: r.top
      , target
      }
    )
  }

  // mouse move detected document wide
  const mousemove = ( e : MouseEvent ) => {
    e.preventDefault ()
    const x = e.clientX
    const y = e.clientY
    const clientPos = { x, y }
    // Find closest slot.
    let d: number = MIN_SLOT_DIST
    let target: string
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

    signals.$dragdrop.move
    ( { move: { target, clientPos, copy: e.altKey } } )
  }

  const mouseup = ( e: MouseEvent ) => {
    e.stopPropagation ()
    e.preventDefault ()

    doc.removeEventListener ( 'mousemove', mousemove )
    doc.removeEventListener ( 'mouseup', mouseup )

    signals.$dragdrop.drop ()
  }

  doc.addEventListener ( 'mousemove', mousemove )
  doc.addEventListener ( 'mouseup', mouseup )
}

export module DragDropHelper {
  export const drag =
  ( signals: SignalsType
  , dragclbk: DragCallback
  , clickClbk: ClickCallback
  ) => {
    let evstate: 'down' | 'dragging' | 'up' = 'up'
    let clickpos, nodePos

    const mouseup = ( e ) => {
      e.preventDefault ()
      // Do not stopPropagation here or we miss drag release.

      if ( evstate === 'down' ) {
        // Only handle simple click here. The drop operation happens in
        // docup.
        clickClbk ( e )
      }

      evstate = 'up'
    }

    const mousedown = ( e: MouseEvent ) => {
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
    const mousemove = ( e : MouseEvent ) => {
      e.preventDefault ()

      const clientPos = { x: e.clientX, y: e.clientY }

      if ( evstate === 'down' ) {
        if ( Math.abs ( clientPos.x - clickpos.x )
           + Math.abs ( clientPos.y - clickpos.y ) < MIN_DRAG_DIST ) {
          return
        }
        evstate = 'dragging'

        dragclbk ( nodePos, e.altKey )

        // FIXME: How can we wait for after DOM update ?
        setTimeout
        ( () => {
            startDrag ( signals )
          }
        , 80
        )
      }
    }

    const click = ( e: MouseEvent ) => {
      e.preventDefault ()
      e.stopPropagation ()
    }

    return { click, mousedown, mousemove, mouseup }
  }
}
