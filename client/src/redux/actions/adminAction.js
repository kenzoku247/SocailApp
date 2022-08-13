import { GLOBAL_TYPES, DeleteData, EditData, AddData } from './globalTypes'
import { deleteAdminDataAPI, getAdminDataAPI, patchAdminDataAPI, postAdminDataAPI } from '../../utils/fetchData'
import { valid, validPassword } from '../../utils/valid'

export const ADMIN_TYPES = {
    LOAD_USERS: "LOAD_USERS",
    ADMIN_GET_USERS: "ADMIN_GET_USERS",
    ADMIN_GET_POSTS: "ADMIN_GET_POSTS",
    AUTH: "AUTH_ADMIN",
    AUTH_TOKEN: "AUTH_TOKEN"
}

export const getPassword = ({id, data, authData}) => async (dispatch) => {
    try {
        await postAdminDataAPI(`getPassword/${id}`, data, authData.token)
    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response.data.msg}
        })
    }
}

export const login = ({data, authData}) => async (dispatch) => {
    try {

        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})

        const res = await postAdminDataAPI('login', data, authData.token)

        dispatch({type: ADMIN_TYPES.AUTH, payload: true})

        dispatch({ 
            type: ADMIN_TYPES.AUTH_TOKEN, 
            payload: {
                token: res.data.access_admin_token
            } 
        })

        localStorage.setItem("AdminLogin", true)
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

export const refreshAdminToken = ({authData}) => async (dispatch) => {
    const adminLogin = localStorage.getItem("AdminLogin")
    if(adminLogin){
        try {
            const res = await postAdminDataAPI('refresh_admin_token', null, authData.token)
            dispatch({ 
                type: ADMIN_TYPES.AUTH_TOKEN, 
                payload: {
                    token: res.data.access_admin_token
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
}


export const logout = () => async (dispatch) => {
    try {
        localStorage.removeItem('AdminLogin')
        await postAdminDataAPI('logout')
        dispatch({type: ADMIN_TYPES.AUTH, payload: false})
        window.location.href = "/"
    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const getAllUsers = ({authData}) => async (dispatch) => {
    try {
        dispatch({type: ADMIN_TYPES.LOAD_USERS, payload: true})
        const res = getAdminDataAPI('user' , authData.token)
        const users = await res
        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_USERS,
            payload: users.data
            
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const getAllPosts = ({authData}) => async (dispatch) => {
    try {
        dispatch({type: ADMIN_TYPES.LOAD_USERS, payload: true})
        const res = getAdminDataAPI('post' , authData.token)
        const posts = await res
        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_POSTS,
            payload: posts.data
            
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const searchUser = ({search,authData}) => async (dispatch) => {
    try {
        const res = getAdminDataAPI(`search?fullName=${search}` , authData.token)

    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const setRole = ({id,newRole,admin,authData,socket}) => async (dispatch) => {
    try {
        const res = await patchAdminDataAPI(`setRole/${id}` , newRole, authData.token)
        socket.emit('updateRoleUser', admin, {newUser: res.data.user})
        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_USERS,
            payload: {users: EditData(admin.users, id, res.data.user)}
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const setDisable = ({id,isDisabled,admin,authData,socket}) => async (dispatch) => {
    try {
        const res = await patchAdminDataAPI(`setDisable/${id}` , isDisabled, authData.token)
        // socket.emit('updateRoleUser', admin, {newUser: res.data.user})
        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_USERS,
            payload: {users: EditData(admin.users, id, res.data.user)}
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const deleteUser = ({id,admin,authData}) => async (dispatch) => {
    try {

        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_USERS,
            payload: {users: DeleteData(admin.users, id)}
        })

        await deleteAdminDataAPI(`deleteUser/${id}` , authData.token)
    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const createUser = ({data,admin,authData}) => async (dispatch) => {
    const check = valid(data)
    if(check.errLength > 0)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: check.errMsg})
    try {
        const res  = await postAdminDataAPI(`createUser` , data, authData.token)
        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_USERS,
            payload: {users: AddData(admin.users, res.data.user)}
        })
    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}

export const deletePost = ({id,admin,authData}) => async (dispatch) => {
    try {

        dispatch({
            type: ADMIN_TYPES.ADMIN_GET_POSTS,
            payload: {posts: DeleteData(admin.posts, id)}
        })

        await deleteAdminDataAPI(`deletePost/${id}` , authData.token)
    } catch (error) {
        console.log(error);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: error.response}
        })
    }
}