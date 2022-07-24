import { PROFILE_TYPES } from '../actions/profileAction'
import { EditData } from '../actions/globalTypes'

const initialState = {
    loading: false,
    ids: [],
    users: [],
    posts: [],
}

const profileReducer = (state = initialState, action) => {
    switch (action.type){
        case PROFILE_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case PROFILE_TYPES.GET_USER:
            if (state.users.length === 0 || (state.users.every(obj => JSON.stringify(obj) !== JSON.stringify(action.payload.user)))) {
                return {
                    ...state,
                    users: [...state.users, action.payload.user]
                };
            } else {
                return {
                    ...state,
                    users: [...state.users]
                }
            }
        case PROFILE_TYPES.FOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.UNFOLLOW:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.ADDFRIEND:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.UNFRIEND:
            return {
                ...state,
                users: EditData(state.users, action.payload._id, action.payload)
            };
        case PROFILE_TYPES.GET_ID:
            if (state.ids.every(obj => JSON.stringify(obj) !== JSON.stringify(action.payload))) {
                return {
                    ...state,
                    ids: [...state.ids, action.payload]
                };
            } else {
                return {
                    ...state,
                    ids: [...state.ids]
                }
            }
        case PROFILE_TYPES.GET_POSTS:
            if (state.posts.every(obj => JSON.stringify(obj) !== JSON.stringify(action.payload))) {
                return {
                    ...state,
                    posts: [...state.posts, action.payload]
                };
            } else {
                return {
                    ...state,
                    posts: [...state.posts]
                }
            }
        case PROFILE_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };
        default:
            return state;
    }
}

export default profileReducer