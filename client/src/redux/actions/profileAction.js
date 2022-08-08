import { GLOBAL_TYPES, DeleteData } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { imageUpload } from '../../utils/imageUpload'
import { createNotify, removeNotify } from '../actions/notifyAction'


export const PROFILE_TYPES = {
    LOADING: 'LOADING_PROFILE',
    GET_USER: 'GET_PROFILE_USER',
    FOLLOW: 'FOLLOW',
    UNFOLLOW: 'UNFOLLOW',
    ADDFRIEND: 'ADDFRIEND',
    UNFRIEND: 'UNFRIEND',
    GET_ID: 'GET_PROFILE_ID',
    GET_POSTS: 'GET_PROFILE_POSTS',
    UPDATE_POST: 'UPDATE_PROFILE_POST'
}


export const getProfileUsers = ({id, authData}) => async (dispatch) => {
    dispatch({type: PROFILE_TYPES.GET_ID, payload: id})

    try {
        dispatch({type: PROFILE_TYPES.LOADING, payload: true})
        const res = getDataAPI(`user/${id}`, authData.token)
        const res1 = getDataAPI(`user_posts/${id}`, authData.token)
        
        const users = await res;
        const posts = await res1;
        dispatch({
            type: PROFILE_TYPES.GET_USER,
            payload: users.data
        }) 

        dispatch({
            type: PROFILE_TYPES.GET_POSTS,
            payload: {...posts.data, _id: id, page: 2}
        })

        dispatch({type: PROFILE_TYPES.LOADING, payload: false})
    } catch (err) {
        // console.log(err.response);
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
    
}


export const updateProfileUser = ({userData, avatar, backgroundCover, authData}) => async (dispatch) => {
    if(!userData.firstName)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Please add your first name."}})

    if(!userData.lastName)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Please add your last name."}})

    // userData.fullName = userDa

    if(userData.firstName.length > 10)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Your first name is too long."}})
    
    if(userData.lastName.length > 10)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Your last name is too long."}})

    userData.fullName = userData.firstName + ' ' + userData.lastName

    if(userData.story.length > 200)
    return dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: "Your story is too long."}})

    try {
        let avatarChange;
        let coverChange;
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {loading: true}})

        if(avatar) avatarChange = await imageUpload([avatar])
        if(backgroundCover) coverChange = await imageUpload([backgroundCover])

        const res = await patchDataAPI("user", {
            ...userData,
            avatar: avatar ? avatarChange[0].url : authData.user.avatar,
            backgroundCover: backgroundCover ? coverChange[0].url : authData.user.backgroundCover,
        }, authData.token)

        dispatch({
            type: GLOBAL_TYPES.AUTH,
            payload: {
                ...authData,
                user: {
                    ...authData.user, ...userData,
                    avatar: avatar ? avatarChange[0].url : authData.user.avatar,
                    backgroundCover: backgroundCover ? coverChange[0].url : authData.user.backgroundCover,
                }
            }
        })

        dispatch({type: GLOBAL_TYPES.ALERT, payload: {success: res.data.msg}})
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const follow = ({users, user, authData, socket}) => async (dispatch) => {
    let newUser;
    
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: [...user.followers, authData.user]}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: [...item.followers, authData.user]}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.FOLLOW, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: { 
            ...authData,
            user: {...authData.user, followings: [...authData.user.followings, newUser]}
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/follow`, null, authData.token)
        socket.emit('follow', res.data.newUser)

        // Notify
        const msg = {
            id: authData.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${authData.user._id}`,
        }

        dispatch(createNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const unFollow = ({users, user, authData, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, followers: DeleteData(user.followers, authData.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, followers: DeleteData(item.followers, authData.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFOLLOW, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: {
            ...authData,
            user: { 
                ...authData.user, 
                followings: DeleteData(authData.user.followings, newUser._id) 
            }
        }
    })
   

    try {
        const res = await patchDataAPI(`user/${user._id}/unFollow`, null, authData.token)
        socket.emit('unFollow', res.data.newUser)

        // Notify
        const msg = {
            id: authData.user._id,
            text: 'has started to follow you.',
            recipients: [newUser._id],
            url: `/profile/${authData.user._id}`,
        }

        dispatch(removeNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const friendRequest = ({users, user, authData, socket}) => async (dispatch) => {
    let newUser;
    // Add friendsWaitToAccept for newUser
    console.log(users);
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, friendsWaitToAccept: [...user.friendsWaitToAccept, authData.user]}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, friendsWaitToAccept: [...item.friendsWaitToAccept, authData.user]}
            }
        })
    }
    // console.log(newUser);
    dispatch({ type: PROFILE_TYPES.ADDFRIEND, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: { 
            ...authData,
            user: {...authData.user, friendsRequest: [...authData.user.friendsRequest, newUser]}
        }
    })

    try {
        const res = await patchDataAPI(`user/${user._id}/friendRequest`, null, authData.token)
        // console.log(res.data.newUser);
        socket.emit('friendsRequest', res.data.newUser)

        // Notify
        // const msg = {
        //     id: authData.user._id,
        //     text: 'want to make friends with you.',
        //     recipients: [user._id],
        //     url: `/profile/${authData.user._id}`,
        // }

        // dispatch(createNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const acceptFriendsRequest = ({users, user, authData, socket}) => async (dispatch) => {
    let newUser;
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, 
            friends: [...user.friends, authData.user],
            friendsRequest: DeleteData(user.friendsRequest, authData.user._id)
        }
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, 
                    friends: [...item.friends, authData.user],
                    friendsRequest: DeleteData(user.friendsRequest, authData.user._id)
                }
            }
        })
    }
    dispatch({ type: PROFILE_TYPES.UNFRIEND, payload: newUser })
    dispatch({ type: PROFILE_TYPES.ADDFRIEND, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: { 
            ...authData,
            user: {...authData.user, 
                friends: [...authData.user.friends, newUser],
                friendsWaitToAccept: authData.user.friendsWaitToAccept.filter(item => item !== newUser._id)
            }
        }
    })


    try {
        const res = await patchDataAPI(`user/${user._id}/acceptFriend`, null, authData.token)
        socket.emit('acceptFriendsRequest', res.data.newUser)

        // Notify
        const msg = {
            id: authData.user._id,
            text: 'made friends with you.',
            recipients: [newUser._id],
            url: `/profile/${authData.user._id}`,
        }

        dispatch(createNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const cancelFriendsRequest = ({users, user, authData, socket}) => async (dispatch) => {
    let newUser;
    if(users.every(item => item._id !== user._id)){
        newUser = {...user, friendsWaitToAccept: DeleteData(user.friendsWaitToAccept, authData.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, friendsWaitToAccept: DeleteData(item.friendsWaitToAccept, authData.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFRIEND, payload: newUser })

    
    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: {
            ...authData,
            user: { 
                ...authData.user, 
                friendsRequest: DeleteData(authData.user.friendsRequest, newUser._id)
            }
        }
    })
    try {
        const res = await patchDataAPI(`user/${user._id}/cancelFriend`, null, authData.token)
        socket.emit('cancelFriendRequest', res.data.newUser)


    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const refuseFriendsRequest = ({users, user, authData, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, friendsRequest: DeleteData(user.friendsRequest, authData.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, friendsRequest: DeleteData(item.friendsRequest, authData.user._id)}
            }
        })
    }
    console.log(newUser);

    dispatch({ type: PROFILE_TYPES.UNFRIEND, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: {
            ...authData,
            user: { 
                ...authData.user, 
                friendsWaitToAccept: authData.user.friendsWaitToAccept.filter(item => item !== newUser._id)
            }
        }
    })
    try {

        const res = await patchDataAPI(`user/${user._id}/refuseFriend`, null, authData.token)
        // console.log(res.data.newUser);
        socket.emit('refuseFriendRequest', res.data.newUser)


    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}

export const unFriend = ({users, user, authData, socket}) => async (dispatch) => {

    let newUser;

    if(users.every(item => item._id !== user._id)){
        newUser = {...user, friends: DeleteData(user.friends, authData.user._id)}
    }else{
        users.forEach(item => {
            if(item._id === user._id){
                newUser = {...item, friends: DeleteData(item.friends, authData.user._id)}
            }
        })
    }

    dispatch({ type: PROFILE_TYPES.UNFRIEND, payload: newUser })

    dispatch({
        type: GLOBAL_TYPES.AUTH, 
        payload: {
            ...authData,
            user: { 
                ...authData.user, 
                friends: DeleteData(authData.user.friends, newUser._id) 
            }
        }
    })
   

    try {
        const res = await patchDataAPI(`user/${user._id}/unFriend`, null, authData.token)
        socket.emit('unFriend', res.data.newUser)

        // Notify
        const msg = {
            id: authData.user._id,
            text: '',
            recipients: [newUser._id],
            url: `/profile/${authData.user._id}`,
        }

        dispatch(removeNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT, 
            payload: {error: err.response}
        })
    }
}