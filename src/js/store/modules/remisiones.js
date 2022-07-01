import { idb } from '../../utils/idb'

const table = 'remisiones'

export default {
    namespaced: true,
    state: {
        list: []
    },
    getters: {
        get_list: (state) => {
            return state.list
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

        save(state, data = {}) {
            return new Promise((resolve, reject) => {

                try {
                    data.date = new Date().getTime()
                    console.log(data)
                    idb.put({ table, data: data })

                    resolve({ msj: 'Creado correctamente!' })
                } catch (error) {
                    reject({ msj: 'Ha ocurrido un error guardando: ' + error })
                }

            })
        }

    }
}