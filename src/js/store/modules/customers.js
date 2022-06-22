import { request_titan } from '../../utils/request_titan'
import { idb } from '../../utils/idb'

const table = 'customers'

export default {
    namespaced: true,
    state: {
        list: [],

        type_doc: [
            { value: 31, text: "Nit" },
            { value: 13, text: "Cedula" },
            { value: 41, text: "Pasaporte" },
            { value: 47, text: "Permiso esp. Permanencia" },
            { value: 42, text: "Empresa del exterior" },
        ],

        business_relation: [
            { value: 1, text: "Cliente" },
            { value: 2, text: "Proveedor" },
            { value: 3, text: "Colaborador" },
            { value: 4, text: "Seguridad social" },
            { value: 5, text: "Conductor" },
            { value: 6, text: "Agricultor" },
            { value: 7, text: "Propietario vehiculo" },
            { value: 8, text: "Asociado" },
            { value: 9, text: "Franquicia" },
        ],
    },
    getters: {
        get_list: (state) => {
            return state.list.filter(e => e.identificacion_rut != "")
        },
        get_type_doc: (state) => state.type_doc,
        get_business_relation: (state) => state.business_relation
    },
    mutations: {
        set_data(state, data) {
            state.list = data
        },
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

        download(state) {
            return new Promise(async (resolve, reject) => {
                let info = state.rootGetters['user/get_info'] || {}
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: {
                        importarhtml: info.token,
                    },
                    url: state.rootGetters['setting/get_url']('customers'),
                }

                request_titan({ url: ip_service, data })
                    .then(async (res) => {

                        try {
                            let filtro = res.message.filter(e => e.identificacion_rut != "")

                            await idb.set_db({ table, data: filtro })
                            state.commit('set_data', filtro)
                            resolve()

                        } catch (error) {
                            reject(error)
                        }

                    }).catch(reject)
            })
        },

        create(state, data) {
            return new Promise(async (resolve, reject) => {
                try {
                    // validate fields requiered
                    let validate = await state.dispatch('validate_form', data)
                    if (!validate.status) return reject(validate)

                    // fill data
                    if (data.tipoid_rut == 13) {
                        data.descripcion_rut = `${data.primerApellido_rut} ${data.segundoApellido_rut} ${data.nombres_rut}`
                    }
                    let fill_data = await state.dispatch('fill_data', data)
                    fill_data.log = [{ date: new Date().getTime() }]

                    // create data in db
                    idb.put({ table, data: fill_data })
                    resolve({ msj: 'Creado correctamente!' })

                } catch (error) {
                    reject({ msj: 'Ha ocurrido un error guardando: ' + error })
                }
            })
        },

        update(state, { ...data } = {}) {
            return new Promise(async (resolve, reject) => {
                try {
                    // validate fields requiered
                    let validate = await state.dispatch('validate_form', data)
                    if (!validate.status) return reject(validate)

                    // fill data
                    if (data.tipoid_rut == 13) {
                        data.descripcion_rut = `${data.primerApellido_rut} ${data.segundoApellido_rut} ${data.nombres_rut}`
                    }
                    let fill_data = await state.dispatch('fill_data', data)
                    fill_data.log = [{ date: new Date().getTime() }]

                    // get index data in db
                    let index = await idb.getIndex({ table, index: fill_data.identificacion_rut })
                    if (!index) return reject({ error: 'No se encontro cliente para actualizar' })

                    // update data in db
                    fill_data.log = [{ date: new Date().getTime() }]
                    await idb.update({ table, index, data: { ...fill_data } })

                    resolve({ msj: 'Actualizado correctamente!' })
                } catch (error) {
                    reject({ msj: 'Ha ocurrido un error guardando: ' + error })
                }
            })
        },

        fill_data(state, data) {
            let new_obj = {}

            for (const key in data) {
                new_obj[key] = String(data[key])

                if (data[key] == null) new_obj[key] = ""
                if (key == 'identificacion_rut') new_obj[key] = new_obj[key].padStart(15, "0")
            }

            return new_obj
        },

        validate_form(state, data) {
            let error = null

            if (!data.tipoid_rut) error = 'tipoid_rut'
            else if (!data.identificacion_rut) error = 'identificacion_rut'
            else if (!data.dv_rut) error = 'dv_rut'

            else if (data.tipoid_rut == 31 && !data.descripcion_rut) error = 'dv_rut'
            else if (data.tipoid_rut != 31 && !data.primerApellido_rut) error = 'primerApellido_rut'
            else if (data.tipoid_rut != 31 && !data.segundoApellido_rut) error = 'segundoApellido_rut'
            else if (data.tipoid_rut != 31 && !data.nombres_rut) error = 'nombres_rut'

            else if (!data.telefono_rut) error = 'telefono_rut'
            else if (!data.direccion_rut) error = 'direccion_rut'
            else if (!data.ciudad_rut) error = 'ciudad_rut'
            else if (!data.correo_rut) error = 'correo_rut'
            else if (!data.nombrecontac_rut) error = 'nombrecontac_rut'
            else if (!data.telecontacto_rut) error = 'telecontacto_rut'
            else if (!data.relacion_rut) error = 'relacion_rut'
            else if (![0, 1].includes(data.estado_rut)) error = 'estado_rut'

            return {
                status: error ? false : true,
                msj: error ? 'Error, campo obligatorio: ' + error : ''
            }
        }

    }
}