<template>
  <g :transform='transform'>
    <rect :width='width' :height='height'
      :id='index'
      :class='class'
      v-el:rect
    ></rect>
    <path :d='path' :class='class'></path>
    <text :x='tx' :y='ty' class='tbox' :class='class'>{{ name }}</text>
  </g>
</template>

 ( pos.x + TPAD
  , rb.y + rb.height / 2 + sz.th / 4   
<script>
import
{ DEFAULT_LAYOUT
} from '../lib/boxDraw.js'

export default
{ props: [ 'bdef', 'index' ]
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
      const y = this.index * ( DEFAULT_LAYOUT.HEIGHT + 2 )
      return `translate(${x},${y})`
    }
  , x () {
      return 0
    }
  , y () {
      return this.index * ( DEFAULT_LAYOUT.HEIGHT + 2 )
    }
  , tx () {
      return DEFAULT_LAYOUT.TPAD
    }
  , ty () {
      return DEFAULT_LAYOUT.HEIGHT / 2 + 4
      // should be + sz.th/4
    }
  , width () {
      return 120
    }
  , height () {
      return DEFAULT_LAYOUT.HEIGHT
    }
  , class () {
      return this.bdef.className
    }
  , name () {
      return this.bdef.name
    }
  , path () {
      // to compute path, we need to compute size
      // before. Size and position is computed in
      // parent and passed as prop (box.layout) ?
      return ''
    }
  }
}
</script>

<style>
</style>


