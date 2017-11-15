import { GetTextSizeType } from '../types'

function dummy ( text: string ) {
  return { width: text.length }
}

export const getTextSizeCanvas =
( font: string ) : GetTextSizeType => {
  if ( process.env.NODE_ENV === 'test' ) {
    return dummy
  }

  const canvas = document.createElement ( 'canvas' )
  const context = canvas.getContext ( '2d' )
  if ( ! context ) {
    return dummy
  }

  context.font = font
  return ( text: string ) => {
    const w = context.measureText ( text )
    return { width: Math.ceil ( w.width ) }
  }
}
