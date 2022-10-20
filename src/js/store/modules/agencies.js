import { request_titan } from '../../utils/request_titan'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => {
            return state.list.filter(e => e.codigo_agc != "")
        },
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        }
    },
    actions: {
        download(state) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: {
                        importarhtml: info.session + "|",
                    },
                    url: state.rootGetters['setting/get_url']('agencies'),
                }

                let config_user = state.rootGetters['user/get_data_config']

                if (!config_user.state_network) return resolve();

                request_titan({ url: ip_service, data })
                    .then(async (res) => {
                        try {

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