import './style.scss'
import { Component } from '../Component'
import Status from '../Status'

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

const renderStatus = ( el ) => (
  <div class='li'>
    <Status nosvg='true' type={el.type} message={el.message}/>
  </div>
)

export default Component
( { rows: [ 'library', '$rows' ]
  , status: [ '$status' ]
  }
, ( { state, signals } ) => (
    <div id='library'>
      <h3>Library</h3>

      <div class='search'>
        <p>&nbsp;
          <input value='search' class='fld'/>
        </p>

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
      </div>

      <div class='results'>
        <div>
          {/* <li v-if='refreshError' class='error'> ==refreshError</li> */}
          { state.rows.map ( renderLibrary )
           }
        </div>
      </div>

      <div class='console'>
        <p>Console
          { /*<input value='search' class='fld'/> */}
        </p>

        <div>
          { ( state.status || [] ).map ( renderStatus ) }
        </div>
      </div>
    </div>
  )
)
