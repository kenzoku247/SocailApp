import React from 'react'
import Avatar from '../../../../Avatar'
import { imageShow, videoShow } from '../../../../../utils/mediaShow'
import Trash from '../../../../../images/trash.png'
import { useSelector, useDispatch } from 'react-redux'
import { deleteMessages } from '../../../../../redux/actions/messageAction';
import './MsgDisplay.css'

const MsgDisplay = ({user, msg, theme, idFriend, data, reverse}) => {
    const { authData } = useSelector(state => state.auth)
    const { socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const handleDeleteMessages = () => {
        if(!data) return;
        
        if(window.confirm('Do you want to delete?')){
            dispatch(deleteMessages({msg, data, authData, socket}))
        }
    }


    return (
        <div className={`Message_Form Form_${reverse}`}>
            <div className={`MsgDisplay ${reverse}`}>
                <div className="Chat_Avatar">
                    <Avatar src={user.avatar} size="small-avatar" />
                </div>

                <div className="Msg_content">
                    { 
                        user._id === authData.user._id && 
                        <img src={Trash} alt='' onClick={handleDeleteMessages} />
                    }
                    <div>
                        {
                            msg.text && 
                            <div className={`Chat_Text Chat_Text_${reverse}`}
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}}>
                                    {msg.text}
                            </div>
                        }
                        {
                            msg.media.map((item, index) => (
                                <div key={index}>
                                    {
                                        item.url.match(/video/i)
                                        ? videoShow(item.url, theme)
                                        : imageShow(item.url, theme)
                                    }
                                </div>
                            ))
                        }
                    </div>
                
                    {
                        msg.call &&
                        <button className="btn d-flex align-items-center py-3"
                        style={{background: '#eee', borderRadius: '10px'}}>

                            <span className="material-icons font-weight-bold mr-1"
                            style={{ 
                                fontSize: '2.5rem', color: msg.call.times === 0 ? 'crimson' : 'green',
                                filter: theme ? 'invert(1)' : 'invert(0)'
                            }}>
                                {
                                    msg.call.times === 0
                                    ? msg.call.video ? 'videocam_off' : 'phone_disabled'
                                    : msg.call.video ? 'video_camera_front' : 'call'
                                }
                            </span>

                            <div className="text-left">
                                <h6>{msg.call.video ? 'Video Call' : 'Audio Call'}</h6>
                                <small>
                                    {/* {
                                        msg.call.times > 0 
                                        ? <Times total={msg.call.times} />
                                        : new Date(msg.createdAt).toLocaleTimeString()
                                    } */}
                                </small>
                            </div>

                        </button>
                    }
                
                </div>

            </div>
            <div className="Time_Chat">
                {new Date(msg.createdAt).toLocaleString()}
            </div>
        </div>
    )
}

export default MsgDisplay
