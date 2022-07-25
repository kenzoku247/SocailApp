import { GLOBAL_TYPES, DeleteData } from '../actions/globalTypes'
import { postDataAPI, getDataAPI, deleteDataAPI } from '../../utils/fetchData'

export const MESS_TYPES = {
    ADD_USER: 'ADD_USER',
    ADD_MESSAGE: 'ADD_MESSAGE',
    GET_CONVERSATIONS: 'GET_CONVERSATIONS',
    GET_MESSAGES: 'GET_MESSAGES',
    UPDATE_MESSAGES: 'UPDATE_MESSAGES',
    DELETE_MESSAGES: 'DELETE_MESSAGES',
    DELETE_CONVERSATION: 'DELETE_CONVERSATION',
    CHECK_ONLINE_OFFLINE: 'CHECK_ONLINE_OFFLINE'
}



export const addMessage = ({msg, authData, socket}) => async (dispatch) =>{
    dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})

    const { _id, avatar, fullName, username } = authData.user
    socket.emit('addMessage', {...msg, user: { _id, avatar, fullName, username } })
    
    try {
        await postDataAPI('message', msg, authData.token)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getConversations = ({authData, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`conversations?limit=${page * 9}`, authData.token)
        
        let newArr = [];
        res.data.conversations.forEach(item => {
            item.recipients.forEach(cv => {
                if(cv._id !== authData.user._id){
                    newArr.push({...cv, text: item.text, media: item.media, call: item.call})
                }
            })
        })

        dispatch({
            type: MESS_TYPES.GET_CONVERSATIONS, 
            payload: {newArr, result: res.data.result}
        })

    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const getMessages = ({authData, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, authData.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const loadMoreMessages = ({authData, id, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${id}?limit=${page * 9}`, authData.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: id, page}})
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteMessages = ({msg, data, authData}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)
    dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})
    try {
        await deleteDataAPI(`message/${msg._id}`, authData.token)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({authData, id}) => async (dispatch) => {
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: id})
    try {
        await deleteDataAPI(`conversation/${id}`, authData.token)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}