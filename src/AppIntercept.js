// ** React Imports
import axios from 'axios'

// ** Api endpoints
import {
    API_ENDPOINTS
} from '@src/utility/ApiEndPoints'

// Utils
import {
    setLoggedAt,
    setCurrentUser,
    getAccessToken,
    setAccessToken,
    getRefreshToken,
    setRefreshToken,
    setTokenExpires,
    getCompareAndCallRefresh
} from '@utils'

const AppIntercept = () => {
    // const delay = ms => new Promise(res => setTimeout(res, ms))
    let isAlreadyFetchingAccessToken = false

    const setBaseUrl = (path) => {
        if (path.includes(process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT)) {
            return path
        }

        return `${process.env.REACT_APP_BACKEND_REST_API_URL_ENDPOINT}${path}`
    }

    async function refreshTokenRequest() {
        return axios.get(`${API_ENDPOINTS.auth.refreshToken}`).then((auth) => auth.data).catch((error) => error)
    }

    async function getToken() {
        const token = await getAccessToken()
        return token
    }

    // ** Request Interceptor
    axios.interceptors.request.use(async (config) => {
        // ** Get token from localStorage
        const accessToken = await getToken()
        let refreshToken = await getRefreshToken()

        if (!refreshToken) {
            const callRefresh = await getCompareAndCallRefresh()
            if (callRefresh && !isAlreadyFetchingAccessToken) {
                isAlreadyFetchingAccessToken = true
                const response = await refreshTokenRequest()
                if (response && response.flag) {
                    isAlreadyFetchingAccessToken = false
                    const tokenExpires = { refresh: response.data.expiresIn }
                    refreshToken = response.data.accessToken
                    await setRefreshToken(response.data.accessToken)
                    await setTokenExpires(tokenExpires)
                }
            }
            isAlreadyFetchingAccessToken = true
        }

        /* Appending base url */
        if (config.url) {
            config.url = await setBaseUrl(config.url)
        }
        /* /Appending base url */

        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
            // config.headers.Authorization = `${process.env.REACT_APP_TOKEN_TYPE} ${accessToken}`
            config.headers.common['Authorization'] = `${process.env.REACT_APP_TOKEN_TYPE} ${accessToken}`
        }

        if (refreshToken) {
            config.headers.common['Authorization'] = `${process.env.REACT_APP_TOKEN_TYPE} ${refreshToken}`
        }
        // console.log("AppIntercept config ", config)
        return config
    }, (error) => Promise.reject(error))

    // ** Add request/response interceptor
    axios.interceptors.response.use((response) => response,
        (error) => {
            const {
                // config,
                response
            } = error
            // console.log("Interceptors response >>>>>>>> ", response)
            if (response && response.status === 401) {
                setLoggedAt()
                setCurrentUser()
                setAccessToken()
                setRefreshToken()
                setTokenExpires()
                window.location.reload()
            }
            return Promise.reject(error)
        })
}

export default AppIntercept