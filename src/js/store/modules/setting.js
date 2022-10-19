import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'setting'

export default {
    namespaced: true,
    state: {
        ip_service: "https://server1ts.net//financiero/inc/index.php",

        path: "https://server1ts.net/",

        routes: {
            login: "financiero/dlls/login.dll",
            company: "financiero/dlls/CfEmpresaJ.dll",
            customers: "financiero/dlls/cfrutsJ.dll",
            presentations: "ptoVta/dlls/CfunidadprJ.dll",
            products: "financiero/dlls/CfcarglistasJ.dll",
            cities: "Datos/BASE/CIUDADES_DIAN.json",
        },
        data: {},
        menu_user: [
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
                            }
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
                        name: "Sincronizar mobile",
                        link: '/usuario/synapp/'
                    }
                ],
            },
        ],
    },

    getters: {
        get_service: (state) => state.ip_service,
        get_url: (state) => (name) => {
            return `${state.routes[name]}`
        },
        get_data: (state) => state.data,
        get_menu_user: (state) => state.menu_user
    },

    mutations: {
        set_data(state, data) {
            state.data = { ...data[0] }
        }
    },

    actions: {
        query_data(state) {
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

        download(state) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}

                let data = {
                    data: {
                        importarhtml: info.session + "|",
                    },
                    url: state.getters.get_url('company'),
                }

                request_titan({ url: state.state.ip_service, data })
                    .then(async (res) => {

                        try {

                            await idb.clearTable({ table })
                            await idb.set_db({ table, data: res.message })
                            state.commit('set_data', res.message)
                            resolve()

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        },
    }
}