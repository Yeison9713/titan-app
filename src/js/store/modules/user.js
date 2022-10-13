import { idb } from '../../utils/idb'
import _ from 'lodash'
const table = 'user'

export default {
    namespaced: true,

    state: {
        data_config: {
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
        menu: [
            {
                id: 1,
                name: "Procesos",
                submenu: [
                    {
                        id: 11,
                        name: "Remisiones",
                        submenu: [
                            {
                                id: 111,
                                name: "Remision para facturar",
                                link: "/remisiones/facturar/",
                            },
                            {
                                id: 112,
                                name: "Reimpresion de remisiones",
                                link: "/remisiones/imprimir/",
                            },
                        ],
                    },
                    {
                        id: 12,
                        name: "Tesorería",
                        submenu: [
                            {
                                id: 121,
                                name: "Registros",
                            },
                            {
                                id: 122,
                                name: "Reimpresion",
                            },
                            {
                                id: 123,
                                name: "Cierre de caja",
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                name: 'Reportes',
                submenu: [
                    {
                        id: 21,
                        name: "Inventarios",
                        submenu: [
                            {
                                id: 211,
                                name: 'Saldo inventarios',
                                link: 'reporte/inventarios'
                            },
                            {
                                id: 212,
                                name: 'P.Planta y equipos',
                                link: 'reporte/p_p_equipos'
                            },
                        ]
                    },
                    {
                        id: 22,
                        name: "Cartera",
                        link: '/reporte/cartera/'
                    }
                ]
            },
            {
                id: 3,
                name: "Configuración",
                submenu: [
                    {
                        id: 31,
                        name: "Punto de venta",
                        submenu: [
                            {
                                id: 311,
                                name: "Ruts",
                                link: '/ruts/config/'
                            },
                        ],
                    },
                    {
                        id: 32,
                        name: "Actualizar app",
                        link: '/usuario/synapp/'
                    }
                ],
            },
        ],
    },

    getters: {
        get_menu: (state) => state.menu,
        get_info: (state) => {
            try {
                let token = localStorage.token || sessionStorage.token
                return JSON.parse(atob(token) || '{}')
            } catch (error) {
                return {}
            }
        },

        get_data_config: (state) => state.data_config
    },

    mutations: {
        set_data(state, data) {
            let info = { ...data[0] }
            state.data_config = info.prefijo ? info : state.data_config
        }
    },

    actions: {
        login(state, { data, remember_account }) {
            let datos = {
                token: data.at(0),
                code: data.at(4),

                company: {
                    id: data.at(5),
                    name: data.at(2),
                },

                user: {
                    id: data.at(6),
                    name: data.at(1),
                    full_name: data.at(3),
                    password: data.at(7),
                },
            }

            let encode = btoa(JSON.stringify(datos))
            remember_account ? localStorage.token = encode : sessionStorage.token = encode

            setTimeout(() => { location.reload() }, 250);
        },

        logout() {
            localStorage.clear()
            sessionStorage.clear()

            setTimeout(() => { location.reload() }, 250);
        },

        save_config(state, data) {
            return new Promise(async (resolve, reject) => {

                try {

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