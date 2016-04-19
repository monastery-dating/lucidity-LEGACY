import { Component } from 'angular2/core'
import { LeBoxDrag } from '../interact/boxdrag.directive'

@Component
( { selector: 'le-project'
  , directives:
    [ LeBoxDrag
    ]
  , template:
    ` <div id='project'>
        <h3 class='sel'> Gods of India</h3>

        <div class='control'>
          <p>Control</p>

          <div>
            <div le-box-drag class='li'><span>OSC</span></div>
            <div le-box-drag class='li'><span>MIDI</span></div>
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
    `
  }
)
export class ProjectComponent {

}
