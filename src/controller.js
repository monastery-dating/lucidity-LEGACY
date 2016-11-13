import {Controller} from 'cerebral'
import Devtools from 'cerebral/devtools'
import editor from './modules/editor'

export default Controller({
  options: {strictRender: true},
  state: {
  },
  modules: {
    editor
  },
  devtools: process.NODE_ENV === 'production' ? null : Devtools()
})
