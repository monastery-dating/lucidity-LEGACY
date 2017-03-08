
const BASE_PATH = 'editor.composition.i'
const TOOLBOX_PATH = 'editor.$toolbox'

declare var global: any

export function processOps
( { state, props } ) {
  const { ops } = props
  if ( ! ops ) {
    return
  }
  let newselection

  ops.forEach
  ( op => {
      const path = op.path && `${BASE_PATH}.${op.path.join('.i.')}`
      switch ( op.op ) {
        case 'update':
          state.set ( path, op.value )
          break
        case 'delete':
          state.unset ( path )
          break
        case 'select':
          newselection = op.value
          newselection.stringPath = `${BASE_PATH}.${newselection.anchorPath.join('.i.')}`
          break
        case 'toolbox':
          state.set ( TOOLBOX_PATH, op.value )
          break
        default:
          throw new Error ( `Unkown operation '${op.op}'` )
      }
    }
  )
  if ( newselection ) {
    // FIXME: global.selection is bad find another way
    global.selection = newselection
    return { selection: newselection }
  }
}
