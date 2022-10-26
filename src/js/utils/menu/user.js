export const menu_user = [
    {
        id: 1,
        name: "Procesos",
        submenu: [
            {
                id: 11,
                name: "Remisiones",
                submenu: [
                    {
                        id: 111,
                        name: "Remision para facturar",
                        link: "/remisiones/facturar/",
                    },
                    {
                        id: 112,
                        name: "Reimpresion de remisiones",
                        link: "/remisiones/imprimir/",
                    },
                ],
            },
            // {
            //     id: 12,
            //     name: "Tesorería",
            //     submenu: [
            //         {
            //             id: 121,
            //             name: "Registros",
            //         },
            //         {
            //             id: 122,
            //             name: "Reimpresion",
            //         },
            //         {
            //             id: 123,
            //             name: "Cierre de caja",
            //         },
            //     ],
            // },
        ],
    },
    {
        id: 2,
        name: 'Reportes',
        submenu: [
            {
                id: 21,
                name: "Cartera",
                link: '/reporte/cartera/'
            },
        ]
    },
    {
        id: 3,
        name: "Configuración",
        submenu: [
            // {
            //     id: 31,
            //     name: "Punto de venta",
            //     submenu: [
            //         {
            //             id: 311,
            //             name: "Ruts",
            //             link: '/ruts/config/'
            //         },
            //     ],
            // },
            {
                id: 32,
                name: "Sincronizar mobile",
                link: '/usuario/synapp/'
            }
        ],
    },
]