<template>
  <div v-if='true'>
  <svg id='graph'>
    <box v-for='(index, item) in all'
      :box='boxdef [ item ]'
      :index='index'
      ></box>
  </svg>
  </div>
  <ul v-else id='graph'>
    <li v-for='item in all'>{{ boxdef [ item ] }}</li>
  </ul>
</template>

<script>
/*
*/
import Box from './Box'

export default
{ vuex:
  { getters:
    { all ( { graph } ) {
        return graph.all
      }
    , boxdef ( { graph } ) {
        return graph.boxdef
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


