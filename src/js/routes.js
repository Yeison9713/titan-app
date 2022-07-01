import { store } from '../js/store/index'

import NotFoundPage from '../pages/404.vue';
import Ingreso from '../pages/ingreso.vue';

import User from "../pages/user/index.vue"

import Remisiones from "../pages/remisiones/remisiones.vue"
import RemisionesImpresion from "../pages/remisiones/impresiones.vue"

import ReporteCartera from "../pages/reportes/cartera.vue"

import ConfigRuts from "../pages/ruts/config.vue"
import SyncApp from "../pages/user/syncApp.vue"


var routes = [
  {
    path: '/',
    redirect: '/ingreso/'
  },

  securedRoute('/ingreso/', Ingreso),
  securedRoute('/usuario/', User),
  securedRoute('/usuario/synapp/', SyncApp),
  securedRoute('/remisiones/facturar/', Remisiones),
  securedRoute('/remisiones/imprimir/', RemisionesImpresion),

  securedRoute('/reporte/cartera/', ReporteCartera),
  securedRoute('/ruts/config/', ConfigRuts),

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
      let info = store.getters['user/get_info']
      const required = to.route.meta ? to.route.meta.required : false

      if (required && !info) {
        resolve({ component: Ingreso })
      } else if (info && info.token && to.path == '/ingreso/') {
        resolve({ component: User })
      } else {
        resolve({ component: component })
      }

    }
  }
}


export default routes;
