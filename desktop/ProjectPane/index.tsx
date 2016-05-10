import { Component } from '../Component'
import { ProjectSignals } from '../../modules/Project'

const titleChange = function
( signals: ProjectSignals, title: string ) {
  signals.project.changed ( { title } )
}

const focus = ( _, { elm } ) => {
  setTimeout ( () => {
      elm.focus ()
      elm.select ()
    }
  , 0
  )
}

const makeKeyup = function
( signals: ProjectSignals, title: string ) {
  return ( e ) => {
    if ( e.keyCode === 27 ) {
      // ESC = abort
      e.preventDefault ()
      e.target.setAttribute ( 'data-abort', true )
      titleChange ( signals, title )
    }
  }
}

const makeChange = function ( signals: ProjectSignals ) {
  return ( e ) => {
    console.log ( 'change' )
    if ( ! e.target.getAttribute ( 'data-abort' ) ) {
      titleChange ( signals, e.target.value )
    }
  }
}

const editableTitle = function ( state, signals: ProjectSignals ) {
  if ( state.editing ) {
    const keyup = makeKeyup ( signals, state.title )
    const change = makeChange ( signals )
    const title = state.title
    let noblur = false
    return <h3>
      <input class='fld' value={ state.title }
        hook-create={ focus }
        on-keyup={ keyup }
        on-change={ change }
        />
      </h3>
  }
  else {
    return <h3 class='editable' on-click={ ( e ) => signals.project.edit ( {} ) }>
        { state.title }
      </h3>
  }
  /*
  const title = state.title
  return <h3 contentEditable='true'
    on-click={ () => console.log ( 'click' ) }
    on-blur={ () => signals.project.changed ( { title } ) }
    on-keyup={ ( e ) =>  {
      console.log ( e.keyCode )
      if ( e.keyCode === 27 ) {
        e.preventDefault ()
        // abort
        signals.project.changed ( { title } )
      }
    }}
    on-change={ ( e ) => console.log ( 'change' ) }>
      {state.title}
    </h3>
    */
}

export default Component
( { title: [ 'project', 'title' ]
  , editing: [ 'project', '$editing' ]
  , saving: [ 'project', '$saving' ]
  }
, ( { state, signals } ) => (
    <div id='project'>
      { editableTitle ( state, signals ) }

      <div class='control'>
        <p>Control</p>

        <div>
          <div class='li'><span>OSC</span></div>
          <div class='li'><span>MIDI</span></div>
          <div class='li'><span>VST Plugin</span></div>
          <div class='li'><span>Keyboard</span></div>
          <div class='li'><span>Mouse</span></div>
        </div>
      </div>

      <div class='scenes'>
        <p>Scenes</p>

        <div>
          <div class='li'><span>intro</span></div>
          <div class='li sel'><span>cubes</span></div>
          <div class='li'><span>terrain</span></div>
        </div>
      </div>

      <div class='assets'>
        <p>assets</p>

        <div>
          <div class='li'><span>dancing queen.mp4</span></div>
          <div class='li'><span>shiva.jpg</span></div>
          <div class='li'><span>components (lib)</span></div>
          <div class='li'><span>lucy-forge (lib)</span></div>
        </div>
      </div>
    </div>
  )
)
