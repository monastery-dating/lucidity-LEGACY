import { Component } from 'angular2/core'

@Component
( { selector: 'le-project'
  , template:
    ` <div id='project'>
        <h3 class='sel'> Gods of India</h3>

        <div class='control'>
          <p>Control</p>

          <div class='list'>
            <div>OSC</div>
            <div>MIDI</div>
            <div>VST Plugin</div>
            <div>Keyboard</div>
            <div>Mouse</div>
          </div>
        </div>

        <div class='scenes'>
          <p>Scenes</p>

          <div class='list'>
            <div>intro</div>
            <div class='sel'>cubes</div>
            <div>terrain</div>
          </div>
        </div>

        <div class='assets'>
          <p>assets</p>

          <div class='list'>
            <div>dancing queen.mp4</div>
            <div>shiva.jpg</div>
            <div>components (lib)</div>
            <div>lucy-forge (lib)</div>
          </div>
        </div>

      </div>
    `
  }
)
export class ProjectComponent {

}
