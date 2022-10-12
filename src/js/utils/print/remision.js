import { format_num } from '../plugins'

var remision_pos = (data, logo) => {
    console.log(data)

    let width = 210;
    var total = parseFloat(data.total_rem);
    var productos = [];
    let descripcion64 = "";
    let data_logo = logo ? { image: logo } : { text: '' }

    data.detalle.forEach((el) => {

        descripcion64 = window.atob(
            el.producto.base1_pr +
            el.producto.base2_pr +
            el.producto.base3_pr +
            el.producto.base4_pr +
            el.producto.base5_pr)


        productos.push({
            stack: [
                { text: descripcion64 + "_" + el.descpres_rep, fontSize: 8 },
                {
                    columns: [
                        {
                            text: " ",
                            width: "30%",
                        },
                        {
                            text: el.cantidad,
                            width: "20%",
                            alignment: "right",
                        },

                        {
                            text: el.valorUnitario,
                            width: "20%",
                            alignment: "right",
                        },
                        {
                            text: format_num(el.total),
                            width: "30%",
                            alignment: "center",
                            margin: [15, 0, 0, 0],
                        },
                    ],
                },
            ],
        });
    });



    return {
        // pageSize: "A7",
        pageSize: {
            width,
            height: "auto",
        },
        pageMargins: [10, 10, 10, 10],
        defaultStyle: {
            fontSize: 8,
        },
        styles: {
            headers: {
                margin: [0, 1],
                alignment: "center",
            },
        },
        content: [
            {
                stack: [
                    {
                        ...data_logo,
                        width: 90,
                        alignment: "center",
                        bold: true,
                    },
                ],
            },
            {
                text: [
                    { text: `${data.descrip_empr}\n`, bold: true },
                    `Nit. ${format_num(data.id_empr)}\n`,
                    `Telefono:  ${data.telefono_empr ? data.telefono_empr.trim().replace(/\,/g, " ") : ''}\n`,
                    `Telefóno Ruta 1:  322.248.9847 \n`,
                    `Telefóno Ruta 2:  314.605.1977 \n`,

                    `${data.direccion_empr}\n`,
                    data.Ciudad,
                ],
                alignment: "center",
            },
            {
                text: " ",
                margin: [0, 5],
                alignment: "center",
                bold: true,
            },
            {
                stack: [
                    {
                        text: `REMISION Nro. ${data.consecutivo}`,
                        bold: true,
                        style: "headers",
                        fontSize: 10,
                    },
                    {
                        // text: `Resolución DIAN ${data.nrores_dian.replace(/\s\s+/g, " ")}`,
                        text: ` `,
                        style: "headers",
                    },
                ],
            },
            // {
            //     canvas: [
            //         {
            //             type: "line",
            //             x1: 0,
            //             y1: 0,
            //             x2: width - 20,
            //             // x2: pageSize.width - 20,
            //             y2: 0,
            //             lineWidth: 0.5,
            //             dash: { length: 5, space: 2 },
            //         },
            //     ],
            //     margin: [0, 10, 0, 10],
            // },
            {
                stack: [
                    {
                        text: `Fecha: ${data.fecha.replace(/\s\s+/g, " ")}`,
                        margin: [0, 1],
                        alignment: "left",
                    },
                    {
                        text: `Cliente: ${format_num(data.cliente.identificacion_rut)} - ${data.cliente.descripcion_rut}`,
                        margin: [0, 1],
                        alignment: "left",
                        fontSize: 8,
                    },
                    {
                        text: `Forma de Pago: ${data.descrip_forma_pago}`,
                        margin: [0, 1],
                        alignment: "left",
                        fontSize: 8,
                    },
                    {
                        text: `Vendedor: ${data.elaboro?.operador?.full_name}`,
                        margin: [0, 1],
                        alignment: "left",
                        fontSize: 8,
                    },
                ],
            },
            // {
            //     canvas: [
            //         {
            //             type: "line",
            //             x1: 0,
            //             y1: 0,
            //             x2: width - 20,
            //             y2: 0,
            //             lineWidth: 0.5,
            //             dash: { length: 5, space: 2 },
            //         },
            //     ],
            //     margin: [0, 10, 0, 10],
            // },
            {
                columns: [
                    {
                        width: "35%",
                        text: "Producto",
                        bold: true,
                    },
                    {
                        width: "20%",
                        text: "Cantidad",
                        alignment: "left",
                        bold: true,
                    },
                    {
                        width: "15%",
                        text: "Unitario",
                        alignment: "left",
                        bold: true,
                    },

                    {
                        width: "30%",
                        text: "Subtotal",
                        alignment: "center",
                        bold: true,
                    },
                ],
                margin: [0, 10, 0, 0],
            },
            productos,
            // {
            //     canvas: [
            //         {
            //             type: "line",
            //             x1: 0,
            //             y1: 0,
            //             x2: width - 20,
            //             y2: 0,
            //             lineWidth: 0.5,
            //             dash: { length: 5, space: 2 },
            //         },
            //     ],
            //     margin: [0, 10, 0, 10],
            // },
            {
                columns: [
                    {
                        width: "60%",
                        text: "Total".toUpperCase(),
                        bold: true,
                        fontSize: 9,
                    },
                    {
                        width: "40%",
                        text: `$ ${format_num(total)}`,
                        alignment: "center",
                        bold: true,
                        fontSize: 9,
                    },
                ],
            },
            {
                columns: [
                    {
                        width: "40%",
                        text: "Tarifa",
                    },
                    {
                        width: "30%",
                        text: "Base",
                    },
                    {
                        width: "30%",
                        text: "Iva",
                    },
                ],
                margin: [0, 15, 0, 0],
            },
            {
                columns: [
                    {
                        width: "40%",
                        text: data.tarifa1,
                    },
                    {
                        width: "30%",
                        text: data.base_iva1,
                    },
                    {
                        width: "30%",
                        text: data.vlr_iva1,
                    },
                ],
            },
            {
                columns: [
                    {
                        width: "40%",
                        text: data.tarifa2,
                    },
                    {
                        width: "30%",
                        text: data.base_iva2,
                    },
                    {
                        width: "30%",
                        text: data.vlr_iva2,
                    },
                ],
            },
            // {
            //     canvas: [
            //         {
            //             type: "line",
            //             x1: 0,
            //             y1: 0,
            //             x2: width - 20,
            //             y2: 0,
            //             lineWidth: 0.5,
            //             dash: { length: 5, space: 2 },
            //         },
            //     ],
            //     margin: [0, 5, 0, 10],
            // },
            [
                {
                    columns: [
                        {
                            width: "40%",
                            text: "0%",
                        },
                        {
                            width: "30%",
                            text: "0",
                        },
                        {
                            width: "30%",
                            text: "0",
                        },
                    ],
                },
            ],
            // {
            //     canvas: [
            //         {
            //             type: "line",
            //             x1: 0,
            //             y1: 0,
            //             x2: width - 20,
            //             y2: 0,
            //             lineWidth: 0.5,
            //             dash: { length: 5, space: 2 },
            //         },
            //     ],
            //     margin: [0, 5, 0, 10],
            // },
            {
                text: `Atendido por: ${data.elaboro?.operador?.full_name} \n\n\n\n\n`,
            },
            {
                text: `Firma del Cliente: ________________________________ \n\n\n\n`,
            },

            {
                text: `Software: Titán Soluciones Sas \n\n.`,
                alignment: "center",
            },
        ],
    };
};



export { remision_pos };