const formaPago = [
    { value: 1, text: "Contado" },
    { value: 2, text: "Credito" },
    { value: 3, text: "Anticipo" },
]

const medioPago = [
    { value: 10, text: "Efectivo" },
    { value: 49, text: "Tarjeta debito" },
    { value: 48, text: "Tarjeta de credito" },
    { value: 30, text: "Transferencia" },
    { value: 71, text: "Bono" },
]

const current_date = () => {
    return new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

const gb = {
    formaPago,
    medioPago,
    textValue: function (obj, id, field = "value", resolve = "text") {
        let retornar = this[obj]?.find((e) => e[field] == id);

        if (!retornar || retornar?.text) return retornar?.text || "";
        else return retornar[resolve] || "";
    }
}

const textValue = gb.textValue

export { formaPago, medioPago, textValue, current_date }