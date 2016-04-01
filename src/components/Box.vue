<template>
  <g :transform='transform'>
    <path :d='path' :class='className'></path>
    <text :x='tx' :y='ty' class='tbox' :class='className'>{{ name }}</text>
  </g>
</template>

 ( pos.x + TPAD
  , rb.y + rb.height / 2 + sz.th / 4   
<script>
import
{ DEFAULT_LAYOUT
} from '../lib/boxDraw.js'

export default
{ props: [ 'box' ]
, ready () {
    // could use v-el to register my
    // own drag event listeners
  }
, methods:
  {
  }
, computed:
  { transform () {
      const x = this.box.pos.x
      const y = this.box.pos.y
      return `translate(${x},${y})`
    }
  , tx () {
      return DEFAULT_LAYOUT.TPAD
    }
  , ty () {
      return DEFAULT_LAYOUT.HEIGHT / 2 +
        this.box.size.th / 4
    }
  , width () {
      return this.box.size.w
    }
  , height () {
      return this.box.size.h
    }
  , className () {
      return this.box.className
    }
  , name () {
      return this.box.name
    }
  , path () {
      // to compute path, we need to compute size
      // before. Size and position is computed in
      // parent and passed as prop (box.layout) ?
      return this.box.path
    }
  }
}
</script>

<style>
</style>


