import { GLOBAL_TYPES } from './globalTypes'
import { imageUpload } from '../../utils/imageUpload'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { createNotify, removeNotify } from './notifyAction'

export const POST_TYPES = {
    CREATE_POST: 'CREATE_POST',
    LOADING_POST: 'LOADING_POST',
    GET_POSTS: 'GET_POSTS',
    UPDATE_POST: 'UPDATE_POST',
    GET_POST: 'GET_POST',
    DELETE_POST: 'DELETE_POST'
}


export const createPost = ({content, images, authData, socket}) => async (dispatch) => {
    let media = []
    try {
        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: true} })
        if(images.length > 0) media = await imageUpload(images)

        const res = await postDataAPI('posts', { content, images: media }, authData.token)

        dispatch({ 
            type: POST_TYPES.CREATE_POST, 
            payload: {...res.data.newPost, user: authData.user} 
        })

        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: false} })

        // Notify
        const msg = {
            id: res.data.newPost._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${res.data.newPost._id}`,
            content, 
            image: media[0].url
        }

        dispatch(createNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getPosts = (token) => async (dispatch) => {
    try {
        dispatch({ type: POST_TYPES.LOADING_POST, payload: true })
        const res = await getDataAPI('posts', token)
        dispatch({
            type: POST_TYPES.GET_POSTS,
            payload: {...res.data, page: 2}
        })

        dispatch({ type: POST_TYPES.LOADING_POST, payload: false })
    } catch (err) {
        console.log(err.response)
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const updatePost = ({content, images, authData, status}) => async (dispatch) => {
    let media = []
    const imgNewUrl = images.filter(img => !img.url)
    const imgOldUrl = images.filter(img => img.url)

    if(status.content === content 
        && imgNewUrl.length === 0
        && imgOldUrl.length === status.images.length
    ) return;

    try {
        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: true} })
        if(imgNewUrl.length > 0) media = await imageUpload(imgNewUrl)

        const res = await patchDataAPI(`post/${status._id}`, { 
            content, images: [...imgOldUrl, ...media] 
        }, authData.token)

        dispatch({ type: POST_TYPES.UPDATE_POST, payload: res.data.newPost })

        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {success: res.data.msg} })
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const likePost = ({post, authData, socket}) => async (dispatch) => {
    const newPost = {...post, likes: [...post.likes, authData.user]}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('likePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/like`, null, authData.token)
        
        // Notify
        const msg = {
            id: authData.user._id,
            text: 'liked your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
            content: post.content, 
            image: post.images[0].url
        }

        dispatch(createNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unLikePost = ({post, authData, socket}) => async (dispatch) => {
    const newPost = {...post, likes: post.likes.filter(like => like._id !== authData.user._id)}
    dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost})

    socket.emit('unLikePost', newPost)

    try {
        await patchDataAPI(`post/${post._id}/unlike`, null, authData.token)

        // Notify
        const msg = {
            id: authData.user._id,
            text: 'disliked your post.',
            recipients: [post.user._id],
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, authData, socket}))

    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const getPost = ({detailPost, id, authData}) => async (dispatch) => {
    if(detailPost.every(post => post._id !== id)){
        try {
            const res = await getDataAPI(`post/${id}`, authData.token)
            dispatch({ type: POST_TYPES.GET_POST, payload: res.data.post })
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT,
                payload: {error: err.response}
            })
        }
    }
}

export const deletePost = ({post, authData, socket}) => async (dispatch) => {
    dispatch({ type: POST_TYPES.DELETE_POST, payload: post })

    try {
        const res = await deleteDataAPI(`post/${post._id}`, authData.token)

        // Notify
        const msg = {
            id: post._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${post._id}`,
        }
        dispatch(removeNotify({msg, authData, socket}))
        
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response}
        })
    }
}

export const savePost = ({post, authData}) => async (dispatch) => {
    const newUser = {...authData.user, saved: [...authData.user.saved, post._id]}
    dispatch({ type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})

    try {
        await patchDataAPI(`savePost/${post._id}`, null, authData.token)
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}

export const unSavePost = ({post, authData}) => async (dispatch) => {
    const newUser = {...authData.user, saved: authData.user.saved.filter(id => id !== post._id) }
    dispatch({ type: GLOBAL_TYPES.AUTH, payload: {...authData, user: newUser}})

    try {
        await patchDataAPI(`unSavePost/${post._id}`, null, authData.token)
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}