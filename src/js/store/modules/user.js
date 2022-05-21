export default {
    namespaced: true,

    state: {
        menu_user: [
            {
                id: 1,
                name: "Procesos",
                submenu: [
                    {
                        id: 11,
                        name: "remisiones",
                        submenu: [
                            {
                                id: 111,
                                name: "Remision para facturar",
                                link: "/usuario/remisiones/",
                            },
                            {
                                id: 112,
                                name: "Reimpresion de remisiones",
                                link: "/usuario/remisiones/reimprimir",
                            },
                        ],
                    },
                    {
                        id: 12,
                        name: "Tesorería",
                        submenu: [
                            {
                                id: 121,
                                name: "Registros",
                            },
                            {
                                id: 122,
                                name: "Reimpresion",
                            },
                            {
                                id: 123,
                                name: "Cierre de caja",
                            },
                        ],
                    },
                ],
            },
            {
                id: 2,
                name: "Configuración",
                submenu: [
                    {
                        id: 21,
                        name: "Punto de venta",
                        submenu: [
                            {
                                id: 211,
                                name: "Ruts",
                            },
                        ],
                    },
                    {
                        id: 22,
                        name: "Actualizar app",
                        link: '/usuario/synapp/'
                    }
                ],
            },
        ],
    },

    getters: {
        get_menu_user: (state) => state.menu_user,
    }
}