import { GLOBAL_TYPES } from './globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import {valid, validEmail, validPassword} from '../../utils/valid'


export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('login', data)
        dispatch({ 
            type: GLOBAL_TYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })

        
        
    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const loginWithGoogle = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('google_login', data)
        dispatch({ 
            type: GLOBAL_TYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")
    if(firstLogin){
        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: true} })

        try {
            const res = await postDataAPI('refresh_token')
            dispatch({ 
                type: GLOBAL_TYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: GLOBAL_TYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({ 
                type: GLOBAL_TYPES.ALERT, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    }
}

export const register = (data) => async (dispatch) => {
    const check = valid(data)
    if(check.errLength > 0)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: check.errMsg})
    try {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})
        const res = await postDataAPI('register', data)

        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const activation = (data) => async (dispatch) => {
    try {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})
        const res = await postDataAPI('activation', data)
        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBAL_TYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })

    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const forgot = (data) => async (dispatch) => {
    const check = validEmail(data)
    if(check.errLength > 0)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: check.errMsg})
    try {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})

        const res = await postDataAPI('forgot', data)
        
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const reset = ({data,token}) => async (dispatch) => {
    const check = validPassword(data)
    if(check.errLength > 0)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: check.errMsg})
    try {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})
        const res = await postDataAPI('reset', data,token)
        localStorage.setItem("firstLogin", true)
        dispatch({ 
            type: GLOBAL_TYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })

    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('firstLogin')
        await postDataAPI('logout')
        window.location.href = "/"
    } catch (err) {
        dispatch({ 
            type: GLOBAL_TYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}