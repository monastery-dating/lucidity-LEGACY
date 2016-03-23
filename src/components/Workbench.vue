<template>
  <div id='workbench'>
    <files></files>
    <!-- svg id='files' class='svg'></svg -->
    <svg id='graph' class='svg' width='100%' height='100%'></svg>
  </div>
</template>

<script>
/* global Snap */
import { computeSize, drawOne } from './graph'
import Files from './Files'
import store from '../vuex/store'

const drawGraph = function () {
  // const files = store.state.files
  const graph = store.state.graph

  const ginfo = {}
  const snap = Snap ( '#graph' )

  computeSize ( snap, graph, ginfo, 'g0' )

  drawOne ( snap, graph, ginfo, 'g0', { x: 0,  y: 0 } )

  // snap = Snap ( '#files' )
  // const ainfo = {}

  // computeSize ( snap, files, ainfo, 'f0' )

  // drawOne ( snap, files,  ainfo, 'f0', { x: 0, y: 0 } )
}


export default
{ data () {
    return {}
  }
, ready () {
    drawGraph ()
  }
, methods: {}
, components:
  { Files
  }
}
</script>

<style>
</style>
