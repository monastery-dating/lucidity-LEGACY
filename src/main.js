import App   from './components/App'
import DragDrop from 'vue-drag-drop'
import Playback from './playback/Playback'
import Vue from 'vue'
import store from './vuex/store'

Vue.use ( DragDrop )

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
