import { Component } from 'angular2/core'
import { LibraryComponent } from './library/index'
import { WorkbenchComponent }  from './workbench/index'
import { ProjectComponent } from './project/index'
import { store } from './store/index'

@Component
( { selector: 'le-app'
  , directives:
    [ LibraryComponent
    , WorkbenchComponent
    , ProjectComponent
    ]
  , providers: store
  , template:
    `
  <svg id='scratch' class='svg'>
    <text class='tbox' id='tsizer'></text>
  </svg>
  HELLO START
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
