import './style.scss'
import { Component } from '../Component'
import { DragDropHelper } from '../../modules/DragDrop'
import { ContextType, SignalsType } from '../../modules/context.type'
import { pane } from '../../modules/Factory'

const renderLibrary = ( component, signals: SignalsType ) => {
  // const uinode =
  const { mousedown, mousemove, mouseup } = DragDropHelper.drag
  ( signals
    // start drag
  , ( nodePos ) => {
    signals.$dragdrop.drag
    ( { drag: { componentId: component._id, ownerType: 'library', nodePos }
      }
    )
    return `library-${component._id}-0`
  }
    // click
  , ( e ) => {}
  )

  return <div
        class='li'
        data-drop='library'
        on-mousedown={ mousedown }
        on-mouseup={ mouseup }
        on-mousemove={ mousemove }
        >
      <span data-drop='library'>{ component.name }</span>
    </div>
}

const Pane = pane ( 'library' )

export const Library = Component
( { rows: [ 'library', '$rows' ]
  , status: [ '$status', 'list' ]
  , active: Pane.path
  , drop: [ '$dragdrop', 'drop' ]
  }
, ( { state, signals } ) => {
    // TODO: highlight on drop
    const drop = state.drop && state.drop.ownerType === 'library'
    const klass = { results: true, drop }

    return <Pane class='Library'>
        <Pane.toggle class='fbar bar' data-drop='library'>
          <div class='fa fa-book' data-drop='library'></div>
          <div class='name' data-drop='library'>Library</div>
          <div class='rarrow' data-drop='library'></div>
        </Pane.toggle>

        <Pane.toggle class='bar'>
          <div class='spacer'></div>
          <div class='larrow'></div>
          &nbsp;
        </Pane.toggle>

        <div class='op'
          on-click={ () => signals.library.zip () }>
          download <div class='fa fa-download'></div>
        </div>

        <div class='search'>
          <p>&nbsp;
            <input value='search' class='fld'/>
          </p>
        </div>


        <div class={ klass } data-drop='library'>
          <div data-drop='library'>
            { state.rows.map ( ( component ) => renderLibrary ( component, signals ) ) }
          </div>
        </div>
      </Pane>
  }
)
