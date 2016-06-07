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
  ( pos: Position ): void
}

const MIN_DRAG_DIST = 4 // manhattan distance to trigger a drag

const startDrag = ( signals: SignalsType ) => {
  const doc = document.documentElement
  const dragel = document.getElementById ( 'drag' )

  let getElementUnderMouse

  if ( dragel.tagName === 'svg' ) {
    getElementUnderMouse = ( e ) => {
      const baseclass = dragel.getAttribute ( 'class' )
      dragel.setAttribute ( 'class', baseclass + ' drag-hide' )
      const el = document.elementFromPoint ( e.clientX, e.clientY )
      dragel.setAttribute ( 'class', baseclass )
      return el
    }
  }

  else {
    getElementUnderMouse = ( e ) => {
      const baseclass = dragel.className
      dragel.className = baseclass + ' drag-hide'
      const el = document.elementFromPoint ( e.clientX, e.clientY )
      dragel.className = baseclass
      return el
    }
  }

  // mouse move detected document wide
  const mousemove = ( e : MouseEvent ) => {
    e.preventDefault ()
    const el = getElementUnderMouse ( e )

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
  , dragclbk: DragCallback
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

        dragclbk ( nodePos )

        startDrag ( signals )
      }
    }

    return { mousedown, mousemove, mouseup }
  }
}
