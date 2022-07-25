import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createComment } from '../../../../../../../../../redux/actions/commentAction'
import Picker, { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';
import Smile from '../../../../../../../../../images/smiling.png'
import './InputComment.css'

const InputComment = ({children, post, onReply, setOnReply}) => {
    const [content, setContent] = useState('')

    const { socket, theme } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [emojiOpened, setEmojiOpened] = useState(false)

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setContent(content + emojiObject.emoji)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!content.trim()){
            if(setOnReply) return setOnReply(false);
            return;
        }

        setContent('')
        
        const newComment = {
            content,
            likes: [],
            user: authData.user,
            createdAt: new Date().toISOString(),
            reply: onReply && onReply.commentId,
            tag: onReply && onReply.user
        }
        
        dispatch(createComment({post, newComment, authData, socket}))

        if(setOnReply) return setOnReply(false);
    }
  return (
    <div className='InputComment'>
        <form className="Comment_Input" onSubmit={handleSubmit} >
            {children}
            <input type="text" placeholder="Add your comments..." className='InfoInput' 
            value={content} onChange={e => setContent(e.target.value)}
            style={{
                filter: theme ? 'invert(1)' : 'invert(0)',
                color: theme ? 'white' : '#111',
                background: theme ? 'rgba(0,0,0,.03)' : '',
            }} />

            <div className="Emoji_Comment">
                <img src={Smile} style={{width:"25px", height:"25px"}} alt="" onClick={e => setEmojiOpened((prev) => !prev)}/>
                <div className="Picker_Comment">
                    {emojiOpened ? <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_LIGHT}/> : ""}
                </div>
            </div>

            <button type="submit" className="button">
                Post
            </button>
        </form>
    </div>
  )
}

export default InputComment