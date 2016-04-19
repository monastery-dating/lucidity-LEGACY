import { Component, Inject, OnInit } from 'angular2/core'
import { LeBoxDrag } from './interact/boxdrag.directive'

@Component
( { selector: 'le-test'
  , directives:
    [ LeBoxDrag
    ]
  , template:
    `
      <div>
        <div class='wrapper'>
          <div class='container' style='position:relative'>
            <div le-box-drag>You can move these elements between these two containers</div>
            <div le-box-drag>Moving them anywhere else isn't quite possible</div>
            <div le-box-drag>There's also the possibility of moving elements around in the same container, changing their position</div>
          </div>
          <div class='container' le-box-drag>
            <div le-box-drag>This is the default use case. You only need to specify the containers you want to use</div>
            <div le-box-drag>More interactive use cases lie ahead</div>
          </div>
        </div>
      </div>
    `
  }
)
export class TestComponent {
}
