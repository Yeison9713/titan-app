import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

import { store } from '../../store/index'
import { remision_pos } from './remision.js'
import { getBase64 } from '../plugins'

const print = {
    remision_pos
}

let url_img = 'https://server1ts.net/datos/image/clientes/'

const get_log = async (nit) => {

    getBase64(`${url_img}${nit}.png`)
        .then(res => {
            return res
        })
        .catch(error => {
            return ""
        })
}

const imprimir = async ({ data = {}, formato = '', nit = 0 }) => {

    try {
        if (!formato) throw new error('Formato no definido');
        let logo = await get_log(nit)

        let setting = store.getters['setting/get_data']
        data = { ...data, ...setting }

        let dd = print[formato](data, logo)
        pdfMake.createPdf(dd).open();

        return 'Impresion generada correctamente'
    } catch (error) {
        return 'Ocurrio un error generando la impresion: ' + error
    }

}



export { imprimir }