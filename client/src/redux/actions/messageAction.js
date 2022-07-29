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

    
    try {
        const res = await postDataAPI('message', msg, authData.token)
        dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: res.data.newMessage})

        const { _id, avatar, fullName, username } = authData.user
        socket.emit('addMessage', {...res.data.newMessage, user: { _id, avatar, fullName, username } })
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

export const getMessages = ({authData, idFriend, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${idFriend}?limit=${page * 9}`, authData.token)
        // console.log(res.data.messages);
        if (res) {
            const newData = {...res.data, messages: res.data.messages.reverse()}
            dispatch({type: MESS_TYPES.GET_MESSAGES, payload: {...newData, _id: idFriend, page}})
        }
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const loadMoreMessages = ({authData, idFriend, page = 1}) => async (dispatch) => {
    try {
        const res = await getDataAPI(`message/${idFriend}?limit=${page * 9}`, authData.token)
        const newData = {...res.data, messages: res.data.messages.reverse()}

        dispatch({type: MESS_TYPES.UPDATE_MESSAGES, payload: {...newData, _id: idFriend, page}})
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteMessages = ({msg, data, authData, socket}) => async (dispatch) => {
    const newData = DeleteData(data, msg._id)

    const idMessage = msg._id
    try {
        dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.recipient}})
        socket.emit('deleteMessage', ({newData, msg}))
        await deleteDataAPI(`message/${idMessage}`, authData.token)

    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const deleteConversation = ({authData, idFriend}) => async (dispatch) => {
    console.log(idFriend);
    dispatch({type: MESS_TYPES.DELETE_CONVERSATION, payload: idFriend})
    try {
        await deleteDataAPI(`conversation/${idFriend}`, authData.token)
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}