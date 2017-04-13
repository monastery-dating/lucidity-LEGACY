import { JSX, connect } from '../Component'
import { state, signal } from 'cerebral/tags'
import expandInner from './lib/expandInner'
import getCommand from './lib/getCommand'
import getSelection from './lib/getSelection'

import './style.css'

export default connect
( { compositionInner: state`editor.composition.i`
  , inputChange: signal`editor.inputChanged`
  , backspacePress: signal`editor.backspacePressed`
  , enterPress: signal`editor.enterPressed`
  , selectChange: signal`editor.selectChanged`
  }
, function Editor ( { compositionInner, backspacePress, enterPress, inputChange, selectChange } ) {
    let lastselection

    const onInput = e => {
      const selection = getSelection ()
      const { anchorNode}  = window.getSelection ()
      const value = anchorNode.textContent
      if ( lastselection ) {
        backspacePress ( { selection: lastselection } )
        lastselection = null
      }
      inputChange ( { value, selection } )
    }

    const onKeyDown = e => {
      switch ( e.key ) {
        case 'Enter':
          e.preventDefault ()
          lastselection = null
          enterPress ( { selection: getSelection () } )
          return
        case 'Backspace':
          e.preventDefault ()
          lastselection = null
          backspacePress ( { selection: getSelection () } )
          return
        default:
          // do nothing
      }

      const selection = getSelection ()
      const command = getCommand ( e )
      if ( command ) {
        // handle copy/paste/bold, etc
        // console.log(command)
      } else if ( selection.type === 'Range' ) {
        lastselection = selection
        // backspacePress({selection})
        // then continue with edit ?
      }
    }

    const onSelect = e => {
      const selection = getSelection ()
      selectChange ( { selection } )
    }

    return <div className='Composition'
        onInput={ onInput }
        onSelect={ onSelect }
        onKeyDown={ onKeyDown }
        contentEditable
        suppressContentEditableWarning
        >
        { expandInner ( 'editor.composition', compositionInner ) }
      </div>
  }
)
