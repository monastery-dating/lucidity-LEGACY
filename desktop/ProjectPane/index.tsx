import { Component } from '../Component'

export default Component
( {
  }
, ( { state, signals } ) => (
    <div id='project'>
        <h3 className='sel'> Gods of India</h3>

        <div className='control'>
          <p>Control</p>

          <div>
            <div className='li'><span>OSC</span></div>
            <div className='li'><span>MIDI</span></div>
            <div className='li'><span>VST Plugin</span></div>
            <div className='li'><span>Keyboard</span></div>
            <div className='li'><span>Mouse</span></div>
          </div>
        </div>

        <div className='scenes'>
          <p>Scenes</p>

          <div>
            <div className='li'><span>intro</span></div>
            <div class={{ li: true, sel: true }}><span>cubes</span></div>
            <div className='li'><span>terrain</span></div>
          </div>
        </div>

        <div className='assets'>
          <p>assets</p>

          <div>
            <div className='li'><span>dancing queen.mp4</span></div>
            <div className='li'><span>shiva.jpg</span></div>
            <div className='li'><span>components (lib)</span></div>
            <div className='li'><span>lucy-forge (lib)</span></div>
          </div>
        </div>
      </div>
  )
)
