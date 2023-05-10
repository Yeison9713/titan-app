import { current_date } from '../../utils/global'
import { idb } from '../../utils/idb'
import { request_titan } from '../../utils/request_titan'

const table = 'remisiones'

export default {
    namespaced: true,
    state: {
        list: [],
        consecutive: {},
        all_referrals: {}
    },
    getters: {
        get_list: (state) => {
            return state.list
        },
        get_consecutive: (state) => {
            return state.consecutive
        },
        get_referrals: (state) => {
            return state.all_referrals
        }
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
        set_consecutive(state, data) {
            state.consecutive = data
        },
        set_referrals(state, data) {
            state.all_referrals = data
        }
    },
    actions: {
        validate_consecutive(state, dato1 = '4') {
            return new Promise(async (resolve, reject) => {
                try {
                    let config_user = state.rootGetters['user/get_data_config']

                    if (!config_user.state_network) {
                        state.commit('set_consecutive', config_user)
                    } else {
                        let agencies = state.rootGetters['agencies/get_list']
                        let agencie = agencies.find(e => parseFloat(e.codigo_agc) == parseFloat(config_user.agencia.codigo))

                        await state.dispatch('query_consecutive', {
                            agencie,
                            dato1,
                            prefijo: config_user?.prefijo
                        })
                    }

                    resolve()
                } catch (error) {
                    reject(error)
                }
            })
        },
        query_consecutive(state, { agencie, dato1, prefijo } = {}) {
            return new Promise((resolve, reject) => {
                try {
                    let info = state.rootGetters['middleware/get_info'] || {}
                    let ip_service = state.rootState.setting?.ip_service || ""
                    let date = current_date().split("/").reverse().join("")

                    let data_consecutive = `|${dato1}|${agencie?.codigo_agc}|REM|0|${date}|${prefijo}|`

                    if (dato1 == '1') {
                        data_consecutive = `|${dato1}|${agencie?.codigo_agc}|050|0|${date}|${prefijo}|`
                    }

                    let data = {
                        data: info.session + data_consecutive,
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
            return new Promise(async (resolve, reject) => {

                try {
                    let config_user = state.rootGetters['user/get_data_config']

                    if (!config_user.state_network) {
                        data.date = new Date().getTime()
                        idb.put({ table, data: data })
                        await state.dispatch("user/save_consecutivo", "", { root: true })

                        resolve({ status: 0, message: data })
                    } else {
                        const response = await state.dispatch("post_online", { form: data })
                        const data_print = await state.dispatch("post_print", response.message)

                        const order_data_print = await state.dispatch("order_data_print", {
                            data: data_print.message[0],
                            form: data
                        })

                        resolve({ status: 0, message: order_data_print })
                    }

                } catch (error) {
                    reject({ msj: 'Ha ocurrido un error guardando: ' + error })
                }

            })
        },

        post_online(state, { form }) {
            return new Promise(async (resolve, reject) => {

                try {

                    let ip_service = state.rootState.setting?.ip_service || ""
                    let data = await state.dispatch("order_data_save", { form })

                    request_titan({ url: ip_service, data })
                        .then(resolve).catch(reject)

                } catch (error) {
                    reject(error)
                }

            })
        },

        post_print(state, send_data) {
            return new Promise((resolve, reject) => {

                try {
                    let info = state.rootGetters['middleware/get_info'] || {}
                    let ip_service = state.rootState.setting?.ip_service || ""

                    let data = {
                        data: info.session + `|${send_data}${new Date().getFullYear()}|`,
                        url: state.rootGetters['setting/get_url']('print_referrals'),
                    }

                    request_titan({ url: ip_service, data })
                        .then(resolve)
                        .catch(reject)

                } catch (error) {
                    reject(error)
                }

            })
        },

        order_data_print(state, { data, form }) {
            return {
                cliente: {
                    identificacion_rut: data.nit_cliente.replace(/,/g, ''),
                    descripcion_rut: data.nombre_cliente
                },
                consecutivo: data.numero_fact.trim(),
                // agencia: form.agencia,
                fecha: data.fecha_factura,
                descrip_forma_pago: data.forma_pago,
                observaciones: data.observaciones,
                total_rem: data.total_rem,
                elaboro: data.elaboro,

                detalle: data.productos.map(e => {

                    e.producto = {
                        base1_pr: e.base1_pr,
                        base2_pr: e.base2_pr,
                        base3_pr: e.base3_pr,
                        base4_pr: e.base4_pr,
                        base5_pr: e.base5_pr,
                    }

                    e.cantidad = e.cantidad.trim()
                    e.valorUnitario = e.vlr_unit.trim()
                    e.total = e.vlr_subtotal.trim()

                    return e
                })
            }
        },

        order_data_save(state, { form }) {
            let detalle = {}
            let info = state.rootGetters['middleware/get_info'] || {}

            let date = current_date().split("/").reverse().join("")

            let efectivo = form.efectivo || 0
            let transferencia = form.transferencia || 0
            let banco = form.bancoTransferencia || ''
            let observaciones = form.observaciones || ''

            let data_send = `${form.agencia}|REMI|${form.consecutivo}|${date}|${form.cliente?.identificacion_rut}|${form.formaPago}|${form.diasPlazo}|${form.medioPago}|${observaciones}|0|${efectivo}|${transferencia}|${banco}|`

            form.detalle?.forEach((k, v) => {

                let index = v + 1;
                let name = `DATOJ-${String(index).padStart(3, "0")}`
                let codigo = k.producto.codigopr_list.trim()
                let cantidad = parseFloat(k.cantidad).toFixed(2)
                let total = String(k.total).replace(/,/g, "")
                let descuento = "0.00"
                let iva = "0.00"
                let presentacion = k.presentacion
                let ubicaperfil_empr = state.rootState.setting.data?.ubicaperfil_empr

                detalle[name] = `${codigo}|${cantidad}|${total}|${descuento}|${iva}|${presentacion}|${ubicaperfil_empr}|`
            })

            return {
                data: JSON.stringify({
                    importarhtml: info.session + "|" + data_send,
                    ...detalle,
                }),
                json: true,
                url: state.rootGetters['setting/get_url']('save_referrals'),
            }
        },

        query_referrals(state, form = {}) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let fecha_ini = form.fecha_ini.replaceAll("-", "")
                let fecha_fin = form.fecha_fin.replaceAll("-", "")

                let data = {
                    data: info.session + `|${form?.agencia?.codigo}|0|${fecha_ini}|${fecha_fin}|`,
                    url: state.rootGetters['setting/get_url']('all_referrals'),
                }

                request_titan({ url: ip_service, data })
                    .then((res) => {
                        state.commit("set_referrals", res.message.filter(e => e.agencia_fact != "").reverse())
                        resolve()
                    }).catch(reject)

                resolve();
            })
        },

        pay_customer(state, { data_send, detalle }) {
            return new Promise((resolve, reject) => {
                let info = state.rootGetters['middleware/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: JSON.stringify({
                        importarhtml: info.session + data_send,
                        ...detalle,
                    }),
                    url: state.rootGetters['setting/get_url']('pay_customer'),
                    json: true,
                }

                request_titan({ url: ip_service, data })
                    .then(resolve).catch(reject)

            })
        },

        print_recaudo(state, send_data) {
            return new Promise((resolve, reject) => {

                try {
                    let info = state.rootGetters['middleware/get_info'] || {}
                    let ip_service = state.rootState.setting?.ip_service || ""

                    let data = {
                        data: info.session + `|${send_data.date}|${send_data.agencia}|050|${send_data.consecutivo}|`,
                        url: state.rootGetters['setting/get_url']('print_recaudo'),
                    }

                    request_titan({ url: ip_service, data })
                        .then(resolve)
                        .catch(reject)

                } catch (error) {
                    reject(error)
                }

            })
        },
    }
}