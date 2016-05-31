import { SignalsType } from '../../context.type'
import { UINodeType } from '../../Graph'

interface ClickCallback {
  ( e: MouseEvent ): void
}

const MIN_DRAG_DIST = 4 // manhattan distance to trigger a drag

const startDrag = ( signals: SignalsType ) => {
  const doc = document.documentElement

  // mouse move detected document wide
  const mousemove = ( e : MouseEvent ) => {
    e.preventDefault ()
    const el = document.elementFromPoint ( e.clientX, e.clientY )
    const target = el.getAttribute ( 'data-drop' )
    const clientPos = { x: e.clientX, y: e.clientY }

    signals.$dragdrop.move
    ( { move: { target, clientPos } } )
  }

  const mouseup = ( e: MouseEvent ) => {
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
  , ownerType: string
  , uinode: UINodeType
  , click: ClickCallback
  ) => {
    let evstate: 'down' | 'dragging' | 'up' = 'up'
    let clickpos, nodePos

    const mouseup = ( e ) => {
      if ( evstate === 'down' ) {
        // Only handle simple click here. The drop operation happens in
        // docup.
        click ( e )
      }

      evstate = 'up'
    }

    const mousedown = ( e: MouseEvent ) => {
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
        signals.$dragdrop.drag
        ( { drag: { ownerType, uinode, nodePos } } )

        startDrag ( signals )
      }
    }

    return { mousedown, mousemove, mouseup }
  }
}
