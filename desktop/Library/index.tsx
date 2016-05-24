import './style.scss'
import { Component } from '../Component'
import { ContextType, SignalsType } from '../../modules/context.type'
import { editable, openModal, pane } from '../../modules/Factory'

const renderLibrary = ( el ) => (
  <div class='li'>
    { /*
         class={ [ el.class ]: true }
         style={ { marginLeft: el.pos.x - 1 } }>
      */
    }
    <span>{ el.name }</span>
  </div>
)

const LibraryOptions = pane ( 'library' )

export const Library = Component
( { rows: [ 'library', '$rows' ]
  , status: [ '$status', 'list' ]
  , active: LibraryOptions.path
  }
, ( { state, signals } ) => (
    <LibraryOptions class='Library'>
      <LibraryOptions.toggle class='fbar bar'>
        <div class='fa fa-book'></div>
        <div class='name'>Library</div>
        <div class='larrow'></div>
      </LibraryOptions.toggle>

      <LibraryOptions.toggle class='bar'>
        <div class='spacer'></div>
        <div class='rarrow'></div>
        &nbsp;
      </LibraryOptions.toggle>

      <div class='search'>
        <p>&nbsp;
          <input value='search' class='fld'/>
        </p>

      {/*
        <ol class='saved'>
          <li class='sel'>f</li>
          <li>g</li>
          <li>b</li>
          <li>x</li>
          <li class='add'>+</li>
        </ol>
        <div>
          <div class='refresh' click='refreshLibrary'
            class2='== blink: refreshing '>refresh</div>
        </div>
      */}

      </div>

      <div class='results'>
        <div>
          { state.rows.map ( renderLibrary ) }
        </div>
      </div>
    </LibraryOptions>
  )
)
