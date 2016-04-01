<template>
  <ul id='graph'>
    <li v-for='item in all'>{{item}}</li>
  </ul>
  
</template>

<script>
/*
  <svg id='graph'>
    <box v-for='(index, item) in all'
      :box='bdefs [ item ]'
      :index='index'
      ></box>
  </svg>
*/
import Box from './Box'

export default
{ vuex:
  { getters:
    { all ( { graph } ) {
        return graph.bdefs.all
      }
    , bdefs ( { graph } ) {
        return graph.bdefs
      }
    }
  , actions:
    {
    }
  }
, methods: {}
, components:
  { Box }
}
</script>

<style>
</style>


