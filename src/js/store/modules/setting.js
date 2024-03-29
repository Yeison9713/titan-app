import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'
import { menu_user } from '../../utils/menu/user.js'

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
            agencies: "financiero/dlls/Cfagenciasj.dll",
            // referrals
            consecutive: "financiero/dlls/PrConsecutivoJ.dll",
            save_referrals: "Ptovta/dlls/PrRemision03.dll",
            print_referrals: "Ptovta/dlls/PrRemision01J.dll",
            all_referrals: "Ptovta/dlls/PrRemision02J.dll",
            cartera: "Ptovta/dlls/RpCartRemJ.DLL",
            closeBox: "ptovta/dlls/PrPtocierreJ.dll",
            pay_customer: "Ptovta/dlls/PrRecaudo.dll",
            print_recaudo: "Ptovta/dlls/PrReimpcbJV.dll",

            concepts: "Financiero/dlls/CfconceptosJ.dll",
            bills: "Ptovta/dlls/PREgresoM.dll",
            print_bills: "Ptovta/dlls/PrReimpcbJV.DLL",
            override_referral: "Ptovta/dlls/PranulaRem.dll",
            location: "Financiero/dlls/CfUbicacionesJ.dll",
            products_2: "PtoVta/dlls/CfProductosJ.dll",
            see_portfolio: "Ptovta/dlls/RpSaldos1J.DLL"
        },
        data: {},
        menu_user: [],
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
        },
        set_menu(state, data) {
            state.menu_user = data
        }
    },

    actions: {
        load_menu(state) {
            return new Promise((resolve, reject) => {
                state.commit('set_menu', menu_user)
                resolve()
            })
        },
        query_data(state, omitir = false) {
            return new Promise(async (resolve, reject) => {
                try {
                    let config_user = state.rootGetters['user/get_data_config']

                    if (!config_user.id && !omitir) return resolve();

                    if (!config_user.state_network || omitir) {
                        let data = await idb.get(table)
                        state.commit('set_data', data)
                    } else {
                        await state.dispatch("download", { online: true })
                    }

                    resolve()
                } catch (err) {
                    reject(err)
                }
            })
        },

        download(state, { online = false }) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}

                let data = {
                    data: info.session + "|",
                    url: state.getters.get_url('company'),
                }

                request_titan({ url: state.state.ip_service, data })
                    .then(async (res) => {

                        try {
                            if (!online) {
                                await idb.clearTable({ table })
                                await idb.set_db({ table, data: res.message })
                            }
                            state.commit('set_data', res.message)
                            resolve();

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        },

        get_consecutive(state, data = {}) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let send_data = {
                    data: `${info.session}|${data}`,
                    url: state.rootGetters['setting/get_url']('consecutive'),
                }

                request_titan({ url: ip_service, data: send_data })
                    .then(resolve)
                    .catch(reject)
            })
        }
    }
}