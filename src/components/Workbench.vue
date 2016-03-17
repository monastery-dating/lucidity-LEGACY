<template>
  <div id='workbench'>
    <svg id='files' class='svg'></svg>
    <svg id='graph' class='svg' width='100%' height='100%'></svg>
  </div>
</template>

<script>
/* global Snap */
import { computeSize, drawOne } from './graph'
import store from '../store'

const drawGraph = function () {
  const GRAPH = store.state.graph

  const ginfo = {}
  let snap = Snap ( '#graph' )

  computeSize ( snap, GRAPH.graph, ginfo, 'g0' )
  ginfo.g0.tclass = 'main'

  drawOne ( snap, GRAPH.graph, ginfo, 'g0', { x: 0,  y: 0 } )


  snap = Snap ( '#files' )
  const ainfo = {}

  computeSize ( snap, GRAPH.files, ainfo, 'f0' )
  ainfo.f0.tclass = 'main'

  drawOne ( snap, GRAPH.files,  ainfo, 'f0', { x: 0, y: 0 } )
}


export default
{ data () {
    return {}
  }
, activate: ( done ) => {
    // FIXME: is this the right way to load ?
    // STUDY: http://vuejs.org/examples/svg.html
    // How to make sure Snap is ready ?
    setTimeout
    ( () => {
        drawGraph ()
      }
    , 100
    )
    done ()
  }
, methods: {}
}
</script>

<style>
</style>
