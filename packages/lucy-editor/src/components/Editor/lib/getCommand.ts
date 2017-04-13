// TODO detect platform
const PLAT = 'mac'

const makeAccel =
( event: KeyboardEvent
) : string [] | null => {
  const accel = [ PLAT ] 
  if ( event.ctrlKey ) accel.push ( 'Ctrl' )
  if ( event.altKey ) accel.push ( 'Alt' )
  if ( event.metaKey ) accel.push ( 'Meta' )
  if ( accel.length > 1 && event.shiftKey ) accel.push ( 'Shift' )
  return accel.length > 1 ? accel : null
}

export default function getCommand
( event: KeyboardEvent
) : string | null {
  const accel = makeAccel ( event )
  if ( accel ) {
    accel.push ( event.key )
    return accel.join ( '+' )
  } else {
    return null
  }
}
