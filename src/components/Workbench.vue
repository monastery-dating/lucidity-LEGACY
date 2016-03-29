<template>
  <div id='workbench'>
    <files></files>
    <svg id='graph' class='svg' width='100%' height='100%'></svg>
    <!-- scrap is used to compute element sizes during graph
    construction -->
    <svg id='svgscratch' class='svg' style='opacity:0'></svg>
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
  computeSize ( Snap ( '#scrap' ), graph, ginfo, 'g0' )

  drawOne ( Snap ( '#graph' ), graph, ginfo, 'g0', { x: 0,  y: 0 } )
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
