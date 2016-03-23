<template>
  <svg id='files' v-drop:box>
    <box v-for='(index, item) in all'
      :box='item'
      :index='index'
      ></box>
  </svg>
</template>

<script>
import Box from './Box'
import { filesAdd } from '../vuex/actions'

export default
{ vuex:
  { getters:
    { all ( { files } ) {
        return files.all
      }
    }
  , actions:
    { drop: filesAdd
    }
  }
, methods: {}
, components:
  { Box }
}
</script>

<style>
</style>

