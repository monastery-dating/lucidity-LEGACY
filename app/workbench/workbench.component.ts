import { Component } from 'angular2/core'
import { FilesComponent } from './files/files.component'
import { GraphComponent } from './graph/graph.component'

@Component
( { selector: 'le-workbench'
  , directives:
    [ FilesComponent
    , GraphComponent
    ]
  , template:
    ` <div id='workbench'>
        <svg id='scratch' class='svg'>
          <text class='tbox' id='tsizer'></text>
        </svg>

        <le-files></le-files>
        <le-graph></le-graph>
      </div>
    `
  }
)
export class WorkbenchComponent {

}
/*
<template>
</template>

<script>
import Files from './Files'
import Graph from './Graph'

export default
{ data () {
    return {}
  }
, methods: {}
, components:
  { Files
  , Graph
  }
}
</script>

<style>
</style>
*/
