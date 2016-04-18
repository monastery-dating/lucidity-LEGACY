import { Component } from 'angular2/core'
import { Dragula, DragulaService } from 'ng2-dragula/ng2-dragula'
import { LibraryComponent } from './library/index'
import { ProjectComponent } from './project/index'
import { store } from './store/index'
import { TestComponent } from './test.component'
import { WorkbenchComponent }  from './workbench/index'

@Component
( { selector: 'le-app'
  , directives:
    [ LibraryComponent
    , WorkbenchComponent
    , ProjectComponent
    , TestComponent
    ]
  , providers:
    [ store
    , DragulaService
    ]
  , template:
    `
      <svg id='scratch' class='svg'>
        <text class='tbox' id='tsizer'></text>
      </svg>
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
