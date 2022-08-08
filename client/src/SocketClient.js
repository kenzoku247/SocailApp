import React, { useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { POST_TYPES } from './redux/actions/postAction'
import { GLOBAL_TYPES } from './redux/actions/globalTypes'
import { NOTIFY_TYPES } from './redux/actions/notifyAction'
import { MESS_TYPES } from './redux/actions/messageAction'

import audiobell from './audio/got-it-done-613.mp3'


const spawnNotification = (body, icon, url, title) => {
    let options = {
        body, icon
    }
    let n = new Notification(title, options)

    n.onclick = e => {
        e.preventDefault()
        window.open(url, '_blank')
    }
}

const SocketClient = () => {
    const { socket, notify, online, call } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    // console.log(authData);
    const dispatch = useDispatch()

    const audioRef = useRef()

    // joinUser
    useEffect(() => {
        socket.emit('joinUser', authData.user)
    },[socket, authData.user])

    // Likes
    useEffect(() => {
        socket.on('likeToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socket.off('likeToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('unLikeToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socket.off('unLikeToClient')
    },[socket, dispatch])


    // Comments
    useEffect(() => {
        socket.on('createCommentToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socket.off('createCommentToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('deleteCommentToClient', newPost =>{
            dispatch({type: POST_TYPES.UPDATE_POST, payload: newPost})
        })

        return () => socket.off('deleteCommentToClient')
    },[socket, dispatch])


    // Follow
    useEffect(() => {
        socket.on('followToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('followToClient')
    },[socket, dispatch, authData])

    useEffect(() => {
        socket.on('unFollowToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('unFollowToClient')
    },[socket, dispatch, authData])

    // Friend
    useEffect(() => {
        socket.on('friendsRequestToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('friendsRequestToClient')
    },[socket, dispatch, authData])

    useEffect(() => {
        socket.on('cancelFriendsRequestToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('cancelFriendsRequestToClient')
    },[socket, dispatch, authData])

    useEffect(() => {
        socket.on('refuseFriendsRequestToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('refuseFriendsRequestToClient')
    },[socket, dispatch, authData])
    
    useEffect(() => {
        socket.on('addFriendToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('addFriendToClient')
    },[socket, dispatch, authData])

    useEffect(() => {
        socket.on('unFriendToClient', newUser =>{
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })

        return () => socket.off('unFriendToClient')
    },[socket, dispatch, authData])


    // Notification
    useEffect(() => {
        socket.on('createNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.CREATE_NOTIFY, payload: msg})

            if(notify.sound) audioRef.current.play()
            spawnNotification(
                msg.user.username + ' ' + msg.text,
                msg.user.avatar,
                msg.url,
                'TOGETHER'
            )
        })

        return () => socket.off('createNotifyToClient')
    },[socket, dispatch, notify.sound])

    useEffect(() => {
        socket.on('removeNotifyToClient', msg =>{
            dispatch({type: NOTIFY_TYPES.REMOVE_NOTIFY, payload: msg})
        })

        return () => socket.off('removeNotifyToClient')
    },[socket, dispatch])


    // Message
    useEffect(() => {
        socket.on('addMessageToClient', msg =>{
            dispatch({type: MESS_TYPES.ADD_MESSAGE, payload: msg})

            dispatch({
                type: MESS_TYPES.ADD_USER, 
                payload: {
                    ...msg.user, 
                    text: msg.text, 
                    media: msg.media
                }
            })
        })

        return () => socket.off('addMessageToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('deleteMessageToClient', ({newData, msg}) =>{
            dispatch({type: MESS_TYPES.DELETE_MESSAGES, payload: {newData, _id: msg.sender}})
        })

        return () => socket.off('deleteMessageToClient')
    },[socket, dispatch])

    // Check User Online 
    useEffect(() => {
        socket.emit('checkUserOnline', authData.user)
    },[socket, authData.user])

    useEffect(() => {
        socket.on('checkUserOnlineToMe', data =>{
            data.forEach(item => {
                if(!online.includes(item.id)){
                    dispatch({type: GLOBAL_TYPES.ONLINE, payload: item.id})
                }
            })
        })

        return () => socket.off('checkUserOnlineToMe')
    },[socket, dispatch, online])

    useEffect(() => {
        socket.on('checkUserOnlineToClient', id =>{
            if(!online.includes(id)){
                dispatch({type: GLOBAL_TYPES.ONLINE, payload: id})
            }
        })

        return () => socket.off('checkUserOnlineToClient')
    },[socket, dispatch, online])

    // Check User Offline
    useEffect(() => {
        socket.on('CheckUserOffline', id =>{
            dispatch({type: GLOBAL_TYPES.OFFLINE, payload: id})
        })

        return () => socket.off('CheckUserOffline')
    },[socket, dispatch])


    // Call User
    useEffect(() => {
        socket.on('callUserToClient', data =>{
            dispatch({type: GLOBAL_TYPES.CALL, payload: data})
        })

        return () => socket.off('callUserToClient')
    },[socket, dispatch])

    useEffect(() => {
        socket.on('userBusy', data =>{
            dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: `${call.username} is busy!`}})
        })

        return () => socket.off('userBusy')
    },[socket, dispatch, call])

    // Admin

    // Update Role
    useEffect(() => {
        socket.on('updateRoleUserToClient', ({newUser}) =>{
            console.log(newUser);
            dispatch({type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})
        })
        return () => socket.off('updateRoleUserToClient')
    },[socket, dispatch, authData])

    return (
        <>
            <audio controls ref={audioRef} style={{display: 'none'}} >
                <source src={audiobell} type="audio/mp3" />
            </audio>
        </>
    )
}

export default SocketClient
