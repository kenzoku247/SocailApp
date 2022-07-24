import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'

import Loading from './Loading'
import Toast from './Toast'

const Notify = () => {
    const { alert } = useSelector((state) => state)
    const dispatch = useDispatch()

    return (
        <div>
            {/* <Loading/> */}
            {alert.loading && <Loading />}

            {
                alert.error && 
                <Toast msg={{title: 'Error', body: alert.error}}
                handleShow={() => dispatch({type: GLOBAL_TYPES.ALERT, payload: {}})} 
                bgColor="#dc3545"/>
            }

            {
                alert.success && 
                <Toast msg={{title: 'Success', body: alert.success}} 
                handleShow={() => dispatch({type: GLOBAL_TYPES.ALERT, payload: {}})}
                bgColor="#28a745"/>
            }
        </div>
    )
}

export default Notify
