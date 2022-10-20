import { request_titan } from '../../utils/request_titan'
import _ from 'lodash'

export default {
    namespaced: true,
    state: {
        session: null,
        user: null,
        key_point: null
    },
    getters: {
        get_info: (state) => {

            try {
                let token = localStorage.referrals || sessionStorage.referrals
                return JSON.parse(atob(token) || '{}')
            } catch (error) {
                return {}
            }

        }
    },
    actions: {
        login(state, { company: nit, user, password, remember_account }) {
            return new Promise((resolve, reject) => {
                let ip_service = state.rootState.setting?.ip_service || ""

                let data = {
                    data: `${nit}|${user}|${password}|0|`,
                    url: state.rootGetters['setting/get_url']('login')
                }

                request_titan({ url: ip_service, data })
                    .then(res => {
                        try {
                            let [session, names, company, complete_names, code] = res.message

                            let token = {
                                code,
                                session,
                                company: {
                                    id: nit,
                                    names: company
                                },
                                user: { names, complete_names }
                            }

                            let encode = btoa(JSON.stringify(token))
                            remember_account ? localStorage.referrals = encode : sessionStorage.referrals = encode

                            res.token = encode
                            resolve(res)

                        } catch (error) {
                            reject(error)
                        }
                    }).catch(reject)


            })
        },
        logout(state) {
            sessionStorage.clear()
            localStorage.clear()

            setTimeout(() => location.reload(), 750);
        }
    }
}