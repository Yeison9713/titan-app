
import { createStore } from 'vuex';
import user from './modules/user'
import setting from './modules/setting'
import products from './modules/products'
import presentations from './modules/presentations'
import customers from './modules/customers'
import cities from './modules/cities';

export const store = createStore({
  modules: {
    user,
    setting,
    products,
    presentations,
    customers,
    cities
  }
})
