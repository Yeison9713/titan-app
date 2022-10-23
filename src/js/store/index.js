
import { createStore } from 'vuex';
import middleware from './modules/middleware';
import user from './modules/user'
import setting from './modules/setting'
import products from './modules/products'
import presentations from './modules/presentations'
import customers from './modules/customers'
import cities from './modules/cities';
import remisiones from './modules/remisiones';
import agencies from './modules/agencies';
import cartera from './modules/cartera';

export const store = createStore({
  modules: {
    middleware,
    user,
    setting,
    products,
    presentations,
    customers,
    cities,
    agencies,
    remisiones,
    cartera
  }
})
