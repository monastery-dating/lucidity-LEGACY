<template>
  <svg id='files' v-drop:box>
    <box :box='{ name: "Gods of India" }'
         :index='0'></box>
    <box v-for='(index, item) in all'
      :box='item'
      :index='index + 1'
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

