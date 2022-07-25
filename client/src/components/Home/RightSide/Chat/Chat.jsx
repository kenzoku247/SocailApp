import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserFriend from './UserFriend/UserFriend'
import Minimize from '../../../../images/minus.png'
import Back from '../../../../images/arrowBack.png'
import Call from '../../../../images/call.png'
import Video from '../../../../images/video.png'
import Trash from '../../../../images/trash.png'
import Smile from '../../../../images/smiling.png'
import Send from '../../../../images/send.png'
import Photo from '../../../../images/photo.png'
import './Chat.css'
import { useState } from 'react'
import Picker, { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react'

const Chat = ({openChat,setOpenChat}) => {
    const { online } = useSelector(state => state)
    const {authData} = useSelector(state => state.auth)
    const [idFriend, setIdFriend] = useState('')
    const [showFriendsList, setShowFriendsList] = useState(true)
    const [showChat, setShowChat] = useState(false)
    const [content, setContent] = useState('')
    const [emojiOpened, setEmojiOpened] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const dispatch = useDispatch()

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setContent(content + emojiObject.emoji)
    }

  return (
    <div className='Chat'>
        <div className="Chat_Header">
            <h3 style={{flex:1}}>Chat</h3>   
            { showChat && <img src={Back} alt="" onClick={() => {setShowChat(false);setShowFriendsList(true)}}/>}
            <img src={Minimize} alt="" onClick={() => setOpenChat(false)}/>
        </div>
        { showFriendsList && 
            <div className="Chat_List">
                {authData.user.friends.map( friend => (
                    <div className='Chat_Friend'>
                        <div className=''>
                            <UserFriend key={friend._id}  user={friend}/>
                        </div>
                        <div className="Chat_Open">
                            <button className='button' onClick={() => {setShowFriendsList(false);setIdFriend(friend._id);setShowChat(true)}}>Open Chat</button>
                        </div>
                    </div>
                ))}
            </div>
        }
        { showChat && 
            <div className="Conversation">
                <div className="Chat_Friend">
                    <h3>Vu Phuc</h3>
                    <div className="Chat_Menu">
                        <img src={Call} alt="Call" />
                        <img src={Video} alt="Video" />
                        <img src={Trash} alt="Trash" />
                    </div>
                </div>
                <div className="Chat_Area">
                    <h4>{`Id: ${idFriend}`}</h4>
                </div>
                <div className="Chat_Content">
                    <div className="Content_Text">
                        <textarea name="chat" type='text'  placeholder='Type something...'></textarea>
                    </div>
                    <div className='Emoji_Chat'>
                        <img src={Smile} style={{width:"25px", height:"25px"}} alt="" onClick={e => setEmojiOpened((prev) => !prev)}/>
                        <div className="Picker_Chat">
                            {emojiOpened ? <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_LIGHT}/> : ""}
                        </div>
                    </div>
                    <div className="Content_Media">
                        <label htmlFor="file-input">
                            <img src={Photo} alt="" style={{width:"25px", height:"25px"}}/>
                        </label>
                        <input type="file" name="file" id="file-input" multiple accept="image/*,video/*"/>
                    </div>
                    <div className="Send">
                        <img src={Send} alt="" style={{width:"25px", height:"25px"}}/>

                    </div>
                </div>
            </div>
        }
    </div>
  )
}

export default Chat