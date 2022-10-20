import { idb } from '../../utils/idb'
import _ from 'lodash'
const table = 'user'

export default {
    namespaced: true,

    state: {
        data_config: {
            state_network: true,
            prefijo: null,
            numero: null,
            ubicacion: {
                codigo: null,
                nombre: null,
            },
            agencia: {
                codigo: null,
                nombre: null,
                consecutivo: null,
            },
        },
    },

    getters: {
        get_data_config: (state) => state.data_config
    },

    mutations: {
        set_data(state, data) {
            let info = { ...data[0] }
            state.data_config = info.prefijo ? info : state.data_config
        }
    },

    actions: {
        save_config(state, data) {
            return new Promise(async (resolve, reject) => {

                try {
                    await idb.clearTable({ table })
                    await idb.set_db({ table, data })
                    state.commit('set_data', data)
                    resolve()

                } catch (error) {
                    reject(error)
                }

            })
        },

        query_data_config(state) {
            return new Promise(async (resolve, reject) => {
                try {

                    let data = await idb.get(table)
                    state.commit('set_data', data)
                    resolve()

                } catch (error) {
                    reject(error)
                }

            })
        },

        save_consecutivo(state) {
            return new Promise(async (resolve, reject) => {
                try {

                    let data = _.cloneDeep(state.state.data_config)
                    let consecutivo = parseFloat(data.agencia.consecutivo)
                    data.agencia.consecutivo = String(++consecutivo)

                    // get index data in db
                    let index = await idb.getIndex({ table, index: data.id })
                    if (!index) return reject({ error: 'Falta configurar' })

                    // update consecutivo
                    await idb.update({ table, index, data })
                    resolve()

                } catch (error) {
                    console.log(error)
                    reject(error)
                }

            })
        }
    }
}