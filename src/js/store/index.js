
import { createStore } from 'vuex';
import usuario from './modules/user'

// console.log(user)

export const store = createStore({
  modules: {
    usuario
  }
})

// const store = createStore({
//   state: {
//     products: []
//   },
//   getters: {
//     products({ state }) {
//       return state.products;
//     }
//   },
//   actions: {
//     addProduct({ state }, product) {
//       state.products = [...state.products, product];
//     },
//   },
// })
// export default store;
