import { GetTextSizeType } from '../types'

export const getTextSizeCanvas =
( font: string ) : GetTextSizeType => {
  const canvas = document.createElement ( 'canvas' )
  const context = canvas.getContext ( '2d' )
  context.font = font
  return ( text: string ) => {
    return context.measureText ( text )
  }
}
