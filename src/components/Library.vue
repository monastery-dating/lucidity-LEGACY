<template>
  <div id='library'>
    <h3>Library</h3>

    <div class='search'>
      <p>&nbsp;
        <input value='search'>
      </p>

      <ol class='saved'>
        <li class='sel'>f</li>
        <li>g</li>
        <li>b</li>
        <li>x</li>
        <li class='add'>+</li>
      </ol>

      <ol>
        <li class='refresh' @click='refreshLibrary' v-bind:class='{ blink: refreshing }'>refresh</li>
      </ol>
    </div>

    <ol class='results'>
      <li v-if='refreshError' class='error'>{{ refreshError }}</li>
      <!-- li v-for='item in all' class='{{ boxtype }}' -->
      <li v-for='(index, item) in all' :id='index'
        v-drag:box='{name: item.name}'>
        {{ item.name }}
      </li>
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
import { refreshLibrary } from '../vuex/actions'

export default
{ vuex:
  { getters:
    { all ( { library } ) {
        return library.all
      }
    , refreshing ( { library } ) {
        return library.refreshing
      }
    , refreshError ( { library } ) {
        return library.error
      }
    }
  , actions:
    { refreshLibrary
    }
  }
}
</script>

<style>
</style>
