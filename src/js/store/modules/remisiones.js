import { current_date } from '../../utils/global'
import { idb } from '../../utils/idb'
import { request_titan } from '../../utils/request_titan'

const table = 'remisiones'

export default {
    namespaced: true,
    state: {
        list: [],
        consecutive: {}
    },
    getters: {
        get_list: (state) => {
            return state.list
        },
        get_consecutive: (state) => {
            return state.consecutive
        }
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
        set_consecutive(state, data) {
            state.consecutive = data
        }
    },
    actions: {
        validate_consecutive(state) {
            return new Promise(async (resolve, reject) => {
                try {
                    let config_user = state.rootGetters['user/get_data_config']

                    if (!config_user.state_network) {
                        state.commit('set_consecutive', config_user)
                    } else {
                        let agencies = state.rootGetters['agencies/get_list']
                        let agencie = agencies.find(e => parseFloat(e.codigo_agc) == parseFloat(config_user.agencia.codigo))

                        await state.dispatch('query_consecutive', { agencie })
                    }

                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
        },
        query_consecutive(state, { agencie }) {
            return new Promise((resolve, reject) => {
                try {
                    let info = state.rootGetters['middleware/get_info'] || {}
                    let ip_service = state.rootState.setting?.ip_service || ""
                    let date = current_date().split("/").reverse().join("")

                    let data = {
                        data: {
                            importarhtml: info.session + `|4|${agencie?.codigo_agc}|REM|0|${date}|01|`,
                        },
                        url: state.rootGetters['setting/get_url']('consecutive'),
                    }

                    request_titan({ url: ip_service, data })
                        .then(res => {

                            let data = {
                                agencia: {
                                    codigo: agencie?.codigo_agc,
                                    nombre: agencie?.descripcion_agc,
                                    consecutivo: res.message[0]?.nro_cons?.trim() || ''
                                }
                            }

                            state.commit('set_consecutive', data)
                            resolve()

                        }).catch(reject)

                } catch (error) {
                    reject(error)
                }
            })
        },
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

        save(state, data = {}) {
            return new Promise((resolve, reject) => {

                try {
                    data.date = new Date().getTime()
                    idb.put({ table, data: data })

                    resolve({ msj: 'Creado correctamente!' })
                } catch (error) {
                    reject({ msj: 'Ha ocurrido un error guardando: ' + error })
                }

            })
        }

    }
}