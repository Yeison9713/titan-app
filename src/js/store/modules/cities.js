import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'cities'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_dep: (state) => {
            return state.list
        },

        get_list: (state) => {
            let cities = []

            for (const item of state.list) {
                cities.push.apply(cities, item.municipios)
            }

            return cities;
        },
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
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

        filter_cities(state, dep) {
            return new Promise((resolve, reject) => {
                try {

                    let find = state.state.list.find(e => e.codigo == dep)
                    let retornar = find?.municipios || []
                    resolve(retornar)

                } catch (error) {
                    reject(error)
                }
            })
        },

        download(state) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: info.session + "|",
                    url: state.rootGetters['setting/get_url']('cities'),
                    method: 'GET'
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {

                        try {

                            await idb.set_db({ table, data: res.message.departamentos })
                            state.commit('set_data', res.message.departamentos)
                            resolve()

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        }
    }
}