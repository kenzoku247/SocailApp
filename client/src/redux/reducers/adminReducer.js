import { ADMIN_TYPES } from '../actions/adminAction';

const initialState = {
    logged: false,
    loading: false,
    users : [],
    posts : [],
    feedbacks : [],
    token: ''
}

const adminReducer = (state = initialState, action) => {
    switch (action.type){
        case ADMIN_TYPES.ADMIN_GET_USERS:
            return {
                ...state,
                users: [...action.payload.users]
            }
        case ADMIN_TYPES.ADMIN_GET_POSTS:
            return {
                ...state,
                posts: [...action.payload.posts]
            }
        case ADMIN_TYPES.ADMIN_GET_FEEDBACKS:
            return {
                ...state,
                feedbacks: [...action.payload.feedbacks]
            }
        case ADMIN_TYPES.LOAD_USERS:
            return {
                ...state,
                loading: action.payload
            }
        case ADMIN_TYPES.AUTH:
            return {
                ...state,
                logged: action.payload
            }
        case ADMIN_TYPES.AUTH_TOKEN:
            return {
                ...state,
                token: action.payload.token
            }
        default:
            return state;
    }
}


export default adminReducer
