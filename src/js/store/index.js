
import { createStore } from 'vuex';
import user from './modules/user'
import config from './modules/config'

export const store = createStore({
  modules: {
    user,
    config
  }
})
