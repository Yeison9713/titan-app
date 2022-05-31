
import { createStore } from 'vuex';
import user from './modules/user'
import setting from './modules/setting'
import products from './modules/products'
import customers from './modules/customers'

export const store = createStore({
  modules: {
    user,
    setting,
    products,
    customers
  }
})
