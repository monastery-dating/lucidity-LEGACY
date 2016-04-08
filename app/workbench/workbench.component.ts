import { Component } from 'angular2/core'

@Component
( { selector: 'le-workbench'
  , template: '<p>WORKBENCH</p>'
  }
)
export default class WorkbenchComponent {

}
/*
<template>
  <div id='workbench'>
    <files></files>
    <graph></graph>
  </div>
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
