import { f7 } from 'framework7-vue'
import imask from 'imask'

let toast = (text) => {
    f7.toast
        .create({
            position: 'top',
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

export { toast, loader, format_num, notification, progress }
