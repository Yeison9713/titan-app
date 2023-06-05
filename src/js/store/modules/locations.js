import { request_titan } from '../../utils/request_titan'
export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => {
            return state.list
        },
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        }
    },
    actions: {
        query_list(state,) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: info.session + "1|",
                    url: state.rootGetters['setting/get_url']('location'),
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {
                        state.commit('set_data', res.message)
                        resolve()
                    }).catch(reject)
            })
        },
    }
}