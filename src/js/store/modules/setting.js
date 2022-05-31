import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'setting'

export default {
    namespaced: true,
    state: {
        ip_service: "http://titan-app.com:8084/inc/api.php",

        path: "https://server1ts.net/",

        routes: {
            login: "financiero/dlls/login.dll",
            company: "financiero/dlls/CfEmpresaJ.dll",
            customers: "financiero/dlls/cfrutsJ.dll",
            presentation: "ptoVta/dlls/CfunidadprJ.dll",
            products: "financiero/dlls/CfcarglistasJ.dll",
        },
        data: {}
    },

    getters: {
        get_service: (state) => state.ip_service,

        get_url: (state) => (name) => {
            return `${state.path}${state.routes[name]}`
        },

        get_data: (state) => state.data
    },

    mutations: {
        set_data(state, data) {
            state.data = data
        }
    },

    actions: {
        load_data(state) {
            return new Promise(async (resolve, reject) => {
                try {
                    let data = await idb.get(table)
                    state.commit('set_data', data)
                    resolve()
                } catch (err) {
                    reject(err)
                }
            })
        },

        download(state) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['user/get_info'] || {}

                let data = {
                    data: {
                        importarhtml: info.token + "|",
                    },
                    url: state.getters.get_url('company'),
                }

                request_titan({ url: state.state.ip_service, data })
                    .then(async (res) => {

                        await idb.set_db({ table, data: res.message })
                        state.commit('set_data', res.message)
                        resolve()

                    }).catch(reject)
            })
        },
    }
}