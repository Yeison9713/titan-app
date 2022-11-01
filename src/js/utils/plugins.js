import { f7 } from 'framework7-vue'
import imask from 'imask'
import { request_titan } from './request_titan.js'

let toast = (text) => {
    f7.toast
        .create({
            position: 'bottom',
            text,
            closeTimeout: 5000,
            closeButton: true,
            closeButtonText:
                '<i class="icon f7-icons" style="font-size: 24px; width: 24px; height: 24px; color: #FFF">multiply_circle </i>',
        })
        .open()
}

let loader = (estado, text) => {
    if (estado) return f7.dialog.preloader(text || 'Cargando...')
    else f7.dialog.close()
}

let notification = ({
    titulo,
    titleRightText,
    subtitle,
    text,
    closeTimeout,
}) => {
    return f7.notification.create({
        icon:
            '<i class="icon f7-icons margin-left-half" style="font-size: 14px; width: 14px; height: 14px; color: green;">checkmark_alt</i>',
        title: titulo || 'Notificación',
        // titleRightText: titleRightText || new Date().getDate(),
        subtitle: subtitle || '',
        text: text || '',
        closeOnClick: true,
        closeTimeout: closeTimeout || 3000,
        closeButton: true,
    })
}

let progress = ({ title, progress }) => {
    return f7.dialog.progress(title, progress)
}

let format_num = (val = 0, scale = 0) => {
    let mask = imask.createMask({
        mask: Number,
        scale,
        min: -9999999999999,
        thousandsSeparator: ',',
        radix: '.',
    })

    let val_num = typeof val == 'string' ? val.trim() : val
    let num = parseFloat(val_num || 0).toString()
    mask.resolve(num)
    return `${mask.value}`
}

function getBase64(nit) {
    return new Promise((resolve, reject) => {
        let url = 'https://server1ts.net/Financiero/INC/imgbase64.php?file=' + nit + ".png"
        request_titan({ url })
            .then(resolve)
            .catch(reject)
    })
}

let check_dv = (id) => {
    let numero = String(id);
    let isNitValid = numero >>> 0 === parseFloat(numero) ? true : false;

    if (!isNitValid) return "";

    let vpri;
    let z;

    let x = 0;
    let y = 0;

    if (isNaN(numero)) {
        return "";
    }

    vpri = new Array(16);
    z = numero.length;

    vpri[1] = 3;
    vpri[2] = 7;
    vpri[3] = 13;
    vpri[4] = 17;
    vpri[5] = 19;
    vpri[6] = 23;
    vpri[7] = 29;
    vpri[8] = 37;
    vpri[9] = 41;
    vpri[10] = 43;
    vpri[11] = 47;
    vpri[12] = 53;
    vpri[13] = 59;
    vpri[14] = 67;
    vpri[15] = 71;

    x = 0;
    y = 0;

    for (let i = 0; i < z; i++) {
        y = numero.substr(i, 1);

        x += y * vpri[z - i];
    }

    y = x % 11;

    return y > 1 ? 11 - y : y;
}



export { toast, loader, format_num, notification, progress, check_dv, getBase64 }
