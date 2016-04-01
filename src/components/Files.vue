<template>
  <svg id='files' v-drop:box>
    <template v-if='false'>
    <box :box='{ name: "Gods of India", className: "main" }'
         :index='0'></box>
    <box v-for='(index, item) in all'
      :box='boxdef [ item ]'
      :index='index + 1'
      ></box>
    </template>
  </svg>
</template>

<script>
import Box from './Box'
import { filesAdd } from '../vuex/actions'

// const ainfo = {}
// computeSize ( Snap ( '#scrap' ), files, ainfo, 'f0' )
// drawOne ( snap ( '#files' ), files,  ainfo, 'f0', { x: 0, y: 0 } )

export default
{ vuex:
  { getters:
    { all ( { files } ) {
        return files.all
      }
    , boxdef ( { files } ) {
        return files.boxdef || {}
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

