// import 'babel-polyfill'
import App   from './components/App'
import Playback from './playback/Playback'
import Vue from 'vue'
import store from './vuex/store'

/* eslint-disable no-new */
new Vue
( { el: 'body'
  , store
  , components:
    { App
    , Playback
    }
  }
)
