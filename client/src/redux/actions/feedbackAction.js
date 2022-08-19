import { postDataAPI } from "../../utils/fetchData"
import { GLOBAL_TYPES } from "./globalTypes"


 
export const createFeedback = ({id, content, authData}) => async (dispatch) => {
    try {
        console.log(id);
        console.log(content);
        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: true} })

        await postDataAPI('sendFeedback', {id,content}, authData.token)

        dispatch({ type: GLOBAL_TYPES.ALERT, payload: {loading: false} })
    } catch (err) {
        dispatch({
            type: GLOBAL_TYPES.ALERT,
            payload: {error: err.response.data.msg}
        })
    }
}