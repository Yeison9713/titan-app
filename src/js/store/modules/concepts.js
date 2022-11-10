import { request_titan } from "../../utils/request_titan"

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
        query(state) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: info.session + "|0|0|0|1|",
                    url: state.rootGetters['setting/get_url']('concepts'),
                }

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