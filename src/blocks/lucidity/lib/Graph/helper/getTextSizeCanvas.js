import { GetTextSizeType } from '../types'

export const getTextSizeCanvas =
( font: string ) : GetTextSizeType => {
  const canvas = document.createElement ( 'canvas' )
  const context = canvas.getContext ( '2d' )
  context.font = font
  return ( text: string ) => {
    const w = context.measureText ( text )
    return { width: Math.ceil ( w.width ) }
  }
}
