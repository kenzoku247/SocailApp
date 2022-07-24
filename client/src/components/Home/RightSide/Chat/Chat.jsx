import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserFriend from './UserFriend/UserFriend'
import Minimize from '../../../../images/minus.png'
import './Chat.css'

const Chat = ({openChat,setOpenChat}) => {
    const {authData} = useSelector(state => state.auth)
    const dispatch = useDispatch()
  return (
    <div className='Chat'>
        <div className="Chat_Header">
            <h3>Chat</h3>   
            <img src={Minimize} alt="" onClick={() => setOpenChat(false)}/>
        </div>
        <div className="Chat_List">
            {authData.user.friends.map( friend => (
                <div><UserFriend key={friend._id}  user={friend}/></div>
            ))}
        </div>
    </div>
  )
}

export default Chat