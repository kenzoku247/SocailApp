import { GLOBAL_TYPES } from '../actions/globalTypes'

const initialState = {
    authData: {},
}

const authReducer = (state = initialState, action) => {
    switch (action.type){
        case "AUTH_START":
            return {
                ...state
            }
        case GLOBAL_TYPES.AUTH:
            return {
                authData: action.payload
            };
        default:
            return state;
    }
}


export default authReducer