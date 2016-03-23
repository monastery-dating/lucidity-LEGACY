<template>
  <g :transform='transform'>
    <rect :width='width' :height='height'
      :id='index'
      :class='class'
      v-el:rect
    ></rect>
    <text :x='tx' :y='ty' class='tbox'>{{ name }}</text>
  </g>
</template>

 ( pos.x + TPAD
  , rb.y + rb.height / 2 + sz.th / 4   
<script>
import { HEIGHT, TPAD } from './svg'
import { hashName } from './graph'

export default
{ props: [ 'box', 'index' ]
, ready () {
    // could use v-el to register my
    // own drag event listeners
  }
, methods:
  {
  }
, computed:
  { transform () {
      const x = 0
      const y = this.index * ( HEIGHT + 2 )
      return `translate(${x},${y})`
    }
  , x () {
      return 0
    }
  , y () {
      return this.index * ( HEIGHT + 2 )
    }
  , tx () {
      return TPAD
    }
  , ty () {
      return HEIGHT / 2 + 4
      // FIXME should be + sz.th/4
    }
  , width () {
      return 120
    }
  , height () {
      return HEIGHT
    }
  , class () {
      return `box${ hashName ( this.box.name ) }`
    }
  , name () {
      return this.box.name
    }
  }
}
</script>

<style>
</style>


