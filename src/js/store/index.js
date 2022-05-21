
import { createStore } from 'vuex';
import usuario from './modules/user'

export const store = createStore({
  modules: {
    usuario
  }
})
