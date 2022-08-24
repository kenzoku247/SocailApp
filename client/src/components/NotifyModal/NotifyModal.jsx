import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteAllNotifies, isReadNotify, NOTIFY_TYPES } from '../../redux/actions/notifyAction'
import './NotifyModal.css'
import Notice from '../../images/NoNotice.jpg'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Avatar from '../Avatar.jsx'
import Circle from '../../images/circle.png'
import Minimize from '../../images/minus.png'
import defaultAvatar from '../../images/DefaultAvatar.jpg'

const NotifyModal = () => {
    const { authData } = useSelector(state => state.auth)
    const { notify } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleIsRead = (msg) => {
        dispatch(isReadNotify({msg, authData}))
    }

    const handleMarkAllRead = () => {
        notify.data.map(msg => (
            dispatch(isReadNotify({msg, authData}))
        ))
    }

    const handleSound = () => {
        dispatch({type: NOTIFY_TYPES.UPDATE_SOUND, payload: !notify.sound})
    }

    const handleDeleteAll = () => {
        const newArr = notify.data.filter(item => item.isRead === false)
        if(newArr.length === 0) return dispatch(deleteAllNotifies(authData.token))

        if(window.confirm(`You have ${newArr.length} unread notices. Are you sure you want to delete all?`)){
            return dispatch(deleteAllNotifies(authData.token))
        }
    }

  return (
    <div style={{minWidth: '400px'}}>
        <div className="Notification">
            <h3 style={{fontWeight:'bold'}}>Notification</h3>
            {
                notify.sound 
                ? <i className="fas fa-bell text-danger" 
                style={{fontSize: '1.2rem', cursor: 'pointer'}}
                onClick={handleSound} />

                : <i className="fas fa-bell-slash text-danger"
                style={{fontSize: '1.2rem', cursor: 'pointer'}}
                onClick={handleSound} />
            }
        </div>
        <hr className="mt-0" />
        {
            notify.data.length === 0 &&
            <img src={Notice} alt="Notice" style={{width:'100%',alignItems:"center"}}/>
        }
        <div style={{maxHeight: 'calc(100vh - 200px)', overflow: 'auto'}}>
            {
                notify.data.map((msg, index) => (
                    <li key={index} className="Notify" >
                        <div className="Notify_Header">

                            <Link to={`${msg.url}`} className="Notify_Link"
                                onClick={() => handleIsRead(msg)}>
                                <Avatar src={msg.user && ( msg.user.avatar ? msg.user.avatar : defaultAvatar)} size="big-avatar" />

                                <div className='Notify_Content'>
                                    <div className=''>
                                        <strong style={{fontSize:'14px'}}>{msg.user && (msg.user.avatar ? msg.user.fullName + ' ': "Full Name")}</strong>
                                        <span style={{fontSize:'13px'}}>{msg.text}</span>
                                    </div>
                                    {msg.content && <small style={{fontSize:'12px'}}>{msg.content.length > 20 ? (msg.content.slice(0,20) + '...') : msg.content}</small>}
                                </div>
                                
                                {
                                    msg.image &&
                                    <div style={{width: '30px'}}>
                                        {
                                            msg.image.match(/video/i)
                                            ? <video src={msg.image} width="100%" />
                                            : <img src={msg.image} alt="" style={{maxWidth:'50px'}}/>
                                        }
                                    </div>
                                }
                                
                            </Link>
                            <div className='Notify_Icon'>
                                {
                                    !msg.isRead && 
                                    <>
                                        <img src={Circle} className='NotRead' alt=""/>
                                        <img src={Minimize} alt="" className='Minimize' onClick={() => handleIsRead(msg)}/>
                                    </>
                                }
                            </div>
                        </div>
                        {/* <div className='Notify_Footer'> */}
                        <small className="Notify_Time">
                            {moment(msg.createdAt).fromNow()}
                        </small>
                        {/* </div> */}
                    </li>
                    
                ))
            }

        </div>
        <hr className="my-1" />
        <div className="Notify_Footer">
                <div className="Delete_Notify" onClick={handleDeleteAll}>
                    <h6 style={{cursor: 'pointer'}} >Delete All</h6>
                </div>
                <div className="Mark_All_Read" onClick={handleMarkAllRead}>
                    <h6 style={{cursor: 'pointer'}} >Mark All Read</h6>
                </div>
        </div>
    </div>
  )
}

export default NotifyModal