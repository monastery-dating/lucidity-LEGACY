import { Component, Input } from 'angular2/core'
import { UIBoxType } from './uibox.type'

@Component
( { selector: 'le-box'
  , directives:
    [ BoxComponent
    ]
  , template:
    ` <li>{{box.name}}</li>
    `
  }
)
export class BoxComponent {
  @Input() box: UIBoxType
}
/*
<template>
  <g :transform='transform'>
    <path :d='path' :class='className'></path>
    <text :x='tx' :y='ty' class='tbox' :class='className'>{{ name }}</text>
    <path v-for='slot in slots'
      class='slot'
      :d='slot.path'
      :class='sclass'></path>
  </g>
</template>

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
  , className () {
      return this.box.name === 'filter.Bloom'
        ? this.box.className : `${this.box.className} dark`
    }
  , name () {
      return this.box.name
    }
  , path () {
      return this.box.path
    }
  , slots () {
      return this.box.slots
    }
  , sclass () {
      return this.box.name === 'filter.Bloom' ? 'pulse' : ''
    }
  }
}
</script>

<style>
</style>
*/
