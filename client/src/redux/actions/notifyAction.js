import { GLOBAL_TYPES } from './globalTypes'
import { postDataAPI, deleteDataAPI, getDataAPI, patchDataAPI } from '../../utils/fetchData'

export const NOTIFY_TYPES = {
    GET_NOTIFIES: 'GET_NOTIFIES',
    CREATE_NOTIFY: 'CREATE_NOTIFY',
    REMOVE_NOTIFY: 'REMOVE_NOTIFY',
    UPDATE_NOTIFY: 'UPDATE_NOTIFY',
    UPDATE_SOUND: 'UPDATE_SOUND',
    DELETE_ALL_NOTIFIES: 'DELETE_ALL_NOTIFIES'
}

export const createNotify = ({msg, authData, socket}) => async (dispatch) => {
    try {
        const res = await postDataAPI('notify', msg, authData.token)

        socket.emit('createNotify', {
            ...res.data.notify,
            user: {
                fullName: authData.user.fullName,
                avatar: authData.user.avatar
            }
        })
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response}})
    }
}

export const removeNotify = ({msg, authData, socket}) => async (dispatch) => {
    try {
        await deleteDataAPI(`notify/${msg.id}?url=${msg.url}`, authData.token)
        
        socket.emit('removeNotify', msg)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response}})
    }
}

export const getNotifies = (token) => async (dispatch) => {
    try {
        const res = await getDataAPI('notifies', token)
        
        dispatch({ type: NOTIFY_TYPES.GET_NOTIFIES, payload: res.data.notifies })
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}


export const isReadNotify = ({msg, authData}) => async (dispatch) => {
    dispatch({type: NOTIFY_TYPES.UPDATE_NOTIFY, payload: {...msg, isRead: true}})
try {
        await patchDataAPI(`/isReadNotify/${msg._id}`, null, authData.token)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteAllNotifies = (token) => async (dispatch) => {
    dispatch({type: NOTIFY_TYPES.DELETE_ALL_NOTIFIES, payload: []})
    try {
        await deleteDataAPI('deleteAllNotify', token)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}