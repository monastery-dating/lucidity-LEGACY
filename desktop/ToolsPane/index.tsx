import { Component } from '../Component'

const renderRow = ( el ) => (
  <div class='li'>
    { /*
         class={ [ el.class ]: true }
         style={ { marginLeft: el.pos.x - 1 } }>
      */
    }
    <span>{ el.name }</span>
  </div>
)

export default Component
( { rows: [ 'library', '$rows' ]
  }
, ( { state, signals } ) => (
    <div id='library'>
      <h3>Library</h3>

      <div class='search'>
        <p>&nbsp;
          <input value='search' />
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
          { state.rows.map ( renderRow )
           }
        </div>
      </div>

      <div class='console'>
        <p>Console
          <input value='search'/>
        </p>

        <div>
          <div class='li ok'>
            <span>Generated 34 cubes</span>
            </div>
        </div>
      </div>
    </div>
  )
)
