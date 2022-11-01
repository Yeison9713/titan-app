import { request_titan } from '../../utils/request_titan'

export default {
    namespaced: true,
    list: [],
    getters: {
        get_list: (state) => {
            return state.list
        },
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
    },
    actions: {
        post_informe(state, datos) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: info.session + `|${datos.fecha}|${datos.agencia}|`,
                    url: state.rootGetters['setting/get_url']('closeBox'),
                }

                request_titan({ url: ip_service, data })
                    .then(res => {
                        state.commit('set_data', res.message.filter(e => e.id_rep != ""))
                        resolve()
                    }).catch(reject)
            })
        }
    }
}