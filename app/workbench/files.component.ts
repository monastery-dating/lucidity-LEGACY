import { Component } from 'angular2/core'
import { BoxComponent } from './box.component'

@Component
( { selector: 'le-files'
  , directives:
    [ BoxComponent
    ]
  , template:
    ` <svg id='files' v-drop:box>
        <le-box v-for='item in all'
          box='==boxdef [ item ]'
          ></le-box>
      </svg>
    `
  }
)
export class FilesComponent {

}
/*
<template>
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
        return files.boxdef
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

*/
