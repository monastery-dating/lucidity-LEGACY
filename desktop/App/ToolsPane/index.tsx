import { Component } from 'cerebral-view-snabbdom'

const renderRow = ( el ) => (
  <div className='li'>
    { /*
         class={ [ el.className ]: true }
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

      <div className='search'>
        <p>&nbsp;
          <input value='search' />
        </p>

        <ol className='saved'>
          <li className='sel'>f</li>
          <li>g</li>
          <li>b</li>
          <li>x</li>
          <li className='add'>+</li>
        </ol>

        <div>
          <div className='refresh' click='refreshLibrary'
            className2='== blink: refreshing '>refresh</div>
        </div>
      </div>

      <div className='results'>
        <div>
          {/* <li v-if='refreshError' className='error'> ==refreshError</li> */}
          { state.rows.map ( renderRow )
           }
        </div>
      </div>

      <div className='console'>
        <p>Console
          <input value='search'/>
        </p>

        <div>
          <div className='li ok'><span>Generated 34 cubes</span></div>
        </div>
      </div>
    </div>
  )
)
