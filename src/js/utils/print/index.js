import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from '../print/vfs.js';
pdfMake.vfs = pdfFonts;

import { store } from '../../store/index'
import { remision_pos } from './remision.js'
import { close_box } from './closeBox.js'
import { getBase64 } from '../plugins'

const print = {
    remision_pos,
    close_box
}

const imprimir = ({ data = {}, formato = '', nit = 0 }) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!formato) throw new error('Formato no definido');
            let logo = await getBase64(nit)

            let setting = store.getters['setting/get_data']
            data = { ...data, ...setting }

            let dd = print[formato](data, logo.message.message)

            const pdf = pdfMake.createPdf(dd);

            if (window.Capacitor) {

                pdf.getBase64(data => {
                    console.log("DATA", data);
                    resolve(data);
                });

            } else {
                pdf.open();
                resolve('')
            }

        } catch (error) {
            console.log('Ocurrio un error generando la impresion: ' + error)
            reject(error)
        }

    })


}



export { imprimir }