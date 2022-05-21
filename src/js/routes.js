
import NotFoundPage from '../pages/404.vue';
import Ingreso from '../pages/ingreso.vue';

import User from "../pages/user/index.vue"
import SyncApp from "../pages/user/syncApp.vue"


var routes = [
  {
    path: '/',
    redirect: '/usuario/'
  },

  securedRoute('/ingreso/', Ingreso),
  securedRoute('/usuario/', User),
  securedRoute('/usuario/synapp/', SyncApp),

  {
    path: '(.*)',
    component: NotFoundPage,
  },
];


function securedRoute(path, component, required) {
  return {
    path,
    meta: {
      required: required || false,
    },
    async({ to, from, resolve, reject }) {
      resolve({ component: component })
    }
  }
}


export default routes;
