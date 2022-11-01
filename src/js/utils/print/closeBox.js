import { current_date } from "../global";

const close_box = (data, logo) => {
    console.log({ ...data })
    let concepEgr = [];
    let vlrEgr = [];

    data.egresos.forEach(eg => {
        concepEgr.push(eg.egr_concep_rep);
        vlrEgr.push(eg.egr_valor_rep);
    });

    let margin = {
        left: 20,
        right: 20,
    };

    const subheader = (str) => {
        return {
            style: "subheader",
            margin: [0, 10, 0, 0],
            table: {
                widths: ["*"],
                body: [
                    [{ text: str, alignment: "center" }]
                ]
            },
            layout: 'noBorders'
        }
    };

    const total = (strTotal, vlrTotal) => {
        return {
            style: "subheader",
            margin: [0, 2, 0, 0],
            table: {
                widths: ["70%", "30%"],
                body: [
                    [
                        { text: strTotal, margin: [3, 0, 0, 0] },
                        { text: vlrTotal, alignment: "right" }
                    ]
                ]
            },
            layout: "noBorders"
        }
    };

    return {
        pageSize: {
            width: 200,
            height: "auto",
        },
        pageMargins: [margin.left, 145, margin.right, 40],
        header: function (currentPage, pageCount, pageSize) {
            return [
                {
                    margin: [0, 20, 0, 2],
                    image: 'logo',
                    fit: [80, 80],
                    alignment: "center",
                },
                {
                    fontSize: 6,
                    alignment: "center",
                    stack: [
                        `Nit. ${data.ideditado_empr}`,
                        data.direccion_empr,
                        `${data.Ciudad} - ${data.Departamento}`,
                        `Teléfono: ${data.telefono_empr}`,
                        `Ruta1:  322.248.9847`,
                        `Ruta2:  314.605.1977`
                    ]
                }
            ]
        },
        content: [
            { text: "CIERRE DE CAJA", alignment: "center" },
            {
                fontSize: 6.5,
                margin: [10, 4, 0, 0],
                columns: [
                    {
                        stack: [
                            "Fecha:",
                            "Responsable:",
                            "\nPunto:"
                        ]
                    },
                    {
                        stack: [
                            { text: data.fecha_rep, alignment: "left" },
                            { text: data.resp_rep, alignment: "left", fontSize: 6 },
                            { text: data.agencia_rep, alignment: "left" }
                        ]
                    }
                ]
            },
            {
                margin: [0, 3, 0, 0],
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        x2: 180 - margin.right,
                        y1: 0,
                        y2: 0,
                        lineWidth: 1,
                    },
                ],
            },

            subheader("VENTAS"),
            {
                fontSize: 6.5,
                margin: [10, 2, 0, 0],
                columns: [
                    {
                        stack: [
                            "Efectivo",
                            "Transferencia",
                            "Crédito"
                        ]
                    },
                    {
                        alignment: "right",
                        stack: [
                            data.vta_efectivo_rep.trim(),
                            data.vta_transf_rep.trim(),
                            data.vta_credito_rep.trim()
                        ]
                    }
                ]
            },
            total("TOTAL VENTAS", data.tventas_rep + ".00"),


            subheader("RECAUDOS"),
            {
                fontSize: 6.5,
                margin: [10, 2, 0, 0],
                columns: [
                    {
                        stack: [
                            "Efectivo",
                            "Transferencia",
                        ]
                    },
                    {
                        alignment: "right",
                        stack: [
                            data.rec_efectivo_rep.trim(),
                            data.rec_transf_rep.trim(),
                        ]
                    }
                ]
            },
            total("TOTAL RECAUDOS", data.trecaudo_rep + ".00"),


            subheader("PAGOS ANTICIPADO"),
            {
                fontSize: 6.5,
                margin: [10, 2, 0, 0],
                columns: [
                    {
                        stack: [
                            "Efectivo",
                            "Transferencia",
                        ]
                    },
                    {
                        alignment: "right",
                        stack: [
                            data.ant_efectivo_rep.trim(),
                            data.ant_transf_rep.trim(),
                        ]
                    }
                ]
            },
            total("TOTAL ANTICIPADO", data.tpagoant_rep + ".00"),


            subheader("RESUMEN INGRESOS"),
            {
                fontSize: 6.5,
                margin: [10, 2, 0, 0],
                columns: [
                    {
                        stack: [
                            "Total Efectivo",
                            "Total Transferencia",
                        ]
                    },
                    {
                        alignment: "right",
                        stack: [
                            data.efectivo_rep + ".00",
                            data.transferencia_rep || '0' + ".00",
                        ]
                    }
                ]
            },
            { ...total("TOTAL EFECTIVO RECIBIDO", data.efectivo_rep + ".00"), margin: [0, 7, 0, 0] },


            subheader("EGRESOS"),
            {
                fontSize: 6.5,
                margin: [10, 2, 0, 0],
                columns: [
                    {
                        stack: concepEgr
                    },
                    {
                        alignment: "right",
                        stack: vlrEgr
                    }
                ]
            },
            { ...total("TOTAL EGRESOS", data.tegresos_rep + ".00"), margin: [0, 7, 0, 0] },


            { ...total("TOTAL ENTREGADO", data.tentregado_rep + ".00"), margin: [0, 10, 0, 0], fontSize: 8.6 },
            {
                fontSize: 6.5,
                margin: [10, 2, 0, 0],
                columns: [
                    {
                        stack: [
                            "Moneda",
                            "Billetes",
                        ]
                    },
                    {
                        alignment: "right",
                        stack: [
                            " ",
                            " ",
                        ]
                    }
                ]
            },
            {
                margin: [0, 10, 0, 3],
                canvas: [
                    {
                        type: "line",
                        x1: 0,
                        x2: 180 - margin.right,
                        y1: 0,
                        y2: 0,
                        lineWidth: 1,
                    },
                ],
            },
            { text: "Impreso: ", fontSize: 6.5 },
            { text: current_date(), fontSize: 6.5 }

        ],
        styles: {
            subheader: {
                bold: true,
                fontSize: 7,
                fillColor: "#cccccc",
            },
        },
        images: {
            logo: logo
        }
    }
}

export { close_box }