import { GLOBAL_TYPES } from '../actions/globalTypes'
import { getDataAPI } from '../../utils/fetchData'

export const SUGGESTION_TYPES = {
    LOADING: 'LOADING_SUGGESTION',
    GET_USERS: 'GET_USERS_SUGGESTION',
}

export const getSuggestions = (token) => async (dispatch) => {
    try {
        dispatch({ type: SUGGESTION_TYPES.LOADING, payload: true })
        
        const res = await getDataAPI('suggestionsUser', token)
        dispatch({ type: SUGGESTION_TYPES.GET_USERS, payload: res.data })

        dispatch({ type: SUGGESTION_TYPES.LOADING, payload: false })
        
    } catch (err) {
        dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}