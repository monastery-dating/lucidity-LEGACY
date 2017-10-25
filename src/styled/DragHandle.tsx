import { JSX } from 'builder'
import { styled } from 'styled'

const dragging: any = {}

function dragMove ( e: MouseEvent ) {
  const div = dragging.el
  const dx = e.clientX - dragging.start.x
  const dy = e.clientY - dragging.start.y
  div.setAttribute ( 'data-drag-dx', dx.toString () )
  div.setAttribute ( 'data-drag-dy', dy.toString () )
  div.style.transform = `translate(${ dx }px, ${ dy }px)`
}

export function dragEnd () {
  dragging.el.classList.remove ( 'dragging' )
  window.removeEventListener ( 'mousemove', dragMove )
  window.removeEventListener ( 'mouseup', dragEnd )
}

export function dragStart ( e: React.MouseEvent<HTMLDivElement> ) {
  const div = e.target as HTMLDivElement
  const el = div.parentElement || div
  dragging.el = el
  const dx = parseInt ( el.getAttribute ( 'data-drag-dx' ) || '0' )
  const dy = parseInt ( el.getAttribute ( 'data-drag-dy' ) || '0' )
  dragging.start = { x: e.clientX - dx, y: e.clientY - dy }
  el.classList.add ( 'dragging' )
  window.addEventListener ( 'mousemove', dragMove )
  window.addEventListener ( 'mouseup', dragEnd )
}

const TheHandle = styled.div`
background: repeating-linear-gradient(
  45deg,
  #606dbc,
  #606dbc 10px,
  #465298 10px,
  #465298 20px
);
opacity: 0.2;
width: 100%;
height: 15px;
`

export const DragHandle = () =>
  <TheHandle
    onMouseDown={ dragStart }
    onMouseUp={ dragEnd }
    />
