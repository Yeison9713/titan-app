import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'products'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => {
            return state.list.filter(e => e.codigo_list != "")
        },
        presentations: () => {
            return [
                { value: '001', label: 'Unidad' },
                { value: '002', label: 'Cubeta' },
                { value: '003', label: 'Media cubeta' },
                { value: '004', label: 'Caja' },
                { value: '005', label: 'Arrume' },
                { value: '006', label: 'Cubeta codorniz' },
            ]
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
                    let config_user = state.rootGetters['user/get_data_config']

                    if (!config_user.id) return resolve();

                    if (!config_user.state_network) {
                        let data = await idb.get(table)
                        state.commit('set_data', data)
                    } else {
                        await state.dispatch("download", { online: true })
                    }

                    resolve()
                } catch (err) {
                    reject(err)
                }
            })
        },

        download(state, { online = false }) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: {
                        importarhtml: info.session + "1|0000|",
                    },
                    url: state.rootGetters['setting/get_url']('products'),
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {
                        try {

                            if (!online) await idb.set_db({ table, data: res.message });
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