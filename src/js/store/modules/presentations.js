import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'presentations'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => {
            return state.list.filter(e => e.codigo_rep != "")
        }
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        }
    },
    actions: {
        query_list(state) {
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
                        importarhtml: info.token + "1|",
                    },
                    url: state.rootGetters['setting/get_url']('presentations'),
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {
                        try {

                            await idb.set_db({ table, data: res.message })
                            state.commit('set_data', res.message)
                            resolve()

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)

            })
        }
    }
}