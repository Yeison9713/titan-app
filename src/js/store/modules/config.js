export default {
    namespaced: true,
    state: {
        ip_service: "http://titan-app.com:8084/inc/api.php",

        path: "https://server1ts.net/",

        routes: {
            login: "financiero/dlls/login.dll",
            company: "financiero/dlls/CfEmpresaJ.dll",
            ruts: "financiero/dlls/cfrutsJ.dll",
            presentation: "ptoVta/dlls/CfunidadprJ.dll",
            products: "financiero/dlls/CfcarglistasJ.dll",
        }
    },
    getters: {
        get_service: (state) => state.ip_service,

        get_url: (state) => (name) => {
            return `${state.path}${state.routes[name]}`
        }
    },
    actions: {

    }
}