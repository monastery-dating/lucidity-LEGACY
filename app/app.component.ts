import { Component } from 'angular2/core'
// import { InteractService } from './interact/interact.service'
import { LibraryComponent } from './library/index'
import { ProjectComponent } from './project/index'
import { store } from './store/index'
import { TestComponent } from './test.component'
import { BoxDragComponent } from './interact/boxdrag.component'
import { BoxDragService } from './interact/boxdrag.service'
import { WorkbenchComponent }  from './workbench/index'

@Component
( { selector: 'le-app'
  , directives:
    [ LibraryComponent
    , WorkbenchComponent
    , ProjectComponent
    , BoxDragComponent
    , TestComponent
    ]
  , providers:
    [ store
    , BoxDragService
    ]
  , template:
    `
      <svg id='scratch' class='svg'>
        <text class='tbox' id='tsizer'></text>
      </svg>
      <le-boxdrag></le-boxdrag>
      <le-library></le-library>
      <le-workbench></le-workbench>
      <le-project></le-project>
    `
  }
)
export default class AppComponent {
}
/*
<script>
import Library   from './Library'
import Project   from './Project'
import Workbench from './Workbench'

export default
{ components:
  { Library
  , Project
  , Workbench
  }
}
</script>

<style lang='sass'>
@import "../assets/css/main.scss"
</style>
*/
