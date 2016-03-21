<template>
  <div id='library'>
    <h3>Library</h3>

    <div class='search'>
      <p>&nbsp;
        <input value='search'>
      </p>

      <ol class='saved'>
        <li class='sel'>f</li>
        <li>m</li>
        <li>g</li>
        <li>b</li>
        <li>x</li>
        <li class='add'>+</li>
      </ol>
    </div>

    <ol class='results'>
      <li class='box6' v-on:click="test">filter.Blur</li>
      <li class='box6'>filter.Bloom</li>
      <li class='box6'>filter.Curves</li>
      <li class='box3'>generator.Crackle</li>
      <li class='box2'>misc.Color</li>
    </ol>

    <div class='console'>
      <p>Console
        <input value='search'>
      </p>

      <ol>
        <li class='ok'>Generated 34 cubes</li>
      </ol>
    </div>
  </div>
</template>

<script>
import store from '../store'

export default
{ data () {
    return { msg: 'top' }
  }
, methods:
  { test () {
    store.dispatch ( 'foo', 'This is a test' )
    }
  }
}
</script>

<style>
</style>
