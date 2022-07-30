import { combineReducers } from "redux";

import auth from './authReducer'
import alert from './alertReducer'
import suggest from './suggestionsReducer'
import socket from './socketReducer'
import profile from './profileReducer'
import modal from './modalReducer'
import posts from './postReducer'
import theme from './themeReducer'
import status from './statusReducer'
import notify from './notifyReducer'
import online from './onlineReducer'
import call from './callReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import message from './messageReducer'
import peer from './peerReducer'



export default combineReducers({
    auth, 
    discover,
    alert,
    suggest,
    socket,
    profile,
    modal,
    posts,
    theme,
    status,
    notify,
    online,
    call,
    detailPost,
    message,
    peer
})