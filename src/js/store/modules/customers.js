import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'customers'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => state.list
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
    },
    actions: {
        load_list(state) {
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
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: {
                        importarhtml: info.token,
                    },
                    url: state.rootGetters['setting/get_url']('customers'),
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {
                        await idb.set_db({ table, data: res.message })
                        state.commit('set_data', res.message)
                        resolve()

                    }).catch(reject)
            })
        },


    }
}