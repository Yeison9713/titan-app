import { request_titan } from "../../utils/request_titan"

export default {
    namespaced: true,


    actions: {
        save(state, { send_data, detalle }) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: JSON.stringify({
                        importarhtml: info.session + send_data,
                        ...detalle,
                    }),
                    url: state.rootGetters['setting/get_url']('bills'),
                    json: true,
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {

                        try {

                            resolve(res.message[0])

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        },

        print(state, send_data) {
            return new Promise((resolve, reject) => {
                try {
                    let info = state.rootGetters['middleware/get_info'] || {}
                    let ip_service = state.rootState.setting?.ip_service || ""

                    let data = {
                        data: info.session + send_data,
                        url: state.rootGetters['setting/get_url']('print_bills'),
                    }

                    request_titan({ url: ip_service, data })
                        .then(resolve)
                        .catch(reject)

                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}