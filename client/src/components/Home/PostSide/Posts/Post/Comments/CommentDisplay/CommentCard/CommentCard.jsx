import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { likeComment, unLikeComment, updateComment } from '../../../../../../../../redux/actions/commentAction'
import Heart from '../../../../../../../../images/like.png'
import NotLike from '../../../../../../../../images/notlike.png'
import './CommentCard.css'
import InputComment from './InputComment/InputComment'
import CommentMenu from './CommentMenu/CommentMenu'
import Picker, { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';
import Smile from '../../../../../../../../images/smiling.png'
import DefaultAvatar from '../../../../../../../../images/DefaultAvatar.jpg'


const CommentCard = ({children, comment, post, commentId}) => {
    const { theme } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    // console.log(comment)

    const [emojiOpened, setEmojiOpened] = useState(false)

    const [chosenEmoji, setChosenEmoji] = useState(null);

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setContent(content + emojiObject.emoji)
    }

    const [content, setContent] = useState('')
    const [readMore, setReadMore] = useState(false)

    const [onEdit, setOnEdit] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [loadLike, setLoadLike] = useState(false)

    const [onReply, setOnReply] = useState(false)

    useEffect(() => {
        setContent(comment.content)
        setIsLike(false)
        setOnReply(false)
        if(comment.likes.find(like => like._id === authData.user._id)){
            setIsLike(true)
        }
    },[comment, authData.user._id])

    const handleUpdate = () => {
        if(comment.content !== content){
            dispatch(updateComment({comment, post, content, authData}))
            setOnEdit(false)
        }else{
            setOnEdit(false)
        }
    }


    const handleLike = async () => {
        if(loadLike) return;
        setIsLike(true)

        setLoadLike(true)
        await dispatch(likeComment({comment, post, authData}))
        setLoadLike(false)
    }

    const handleUnLike = async () => {
        if(loadLike) return;
        setIsLike(false)

        setLoadLike(true)
        await dispatch(unLikeComment({comment, post, authData}))
        setLoadLike(false)
    }


    const handleReply = () => {
        if(onReply) return setOnReply(false)
        setOnReply({...comment, commentId})
    }

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? 'inherit' : 'none'
    }
  return (
    <>
        {comment._id && 
            <div className='CommentCard' style={styleCard}>
                <div className="Comment_Header">
                    <img src={comment.user.avatar} alt="avatar" className='Avatar'/>
                    <div className="NameUser">
                        <h6 >
                            <Link to={`/profile/${comment.user._id}`} className="text-dark">
                                {comment.user.fullName}
                            </Link>
                        </h6>
                        <small className="text-muted mr-3">
                            {moment(comment.createdAt).fromNow()}
                        </small>
                    </div>
                </div>


                <div className="Comment_Content">
                    <div className="flex-fill" 
                        style={{
                            filter: theme ? 'invert(1)' : 'invert(0)',
                            color: theme ? 'white' : '#111',
                        }}>
                        {
                            onEdit 
                            ? <textarea rows="3" value={content}
                            onChange={e => setContent(e.target.value)} />

                            : <div className='Content'>
                            {
                                comment.tag && comment.tag._id !== comment.user._id &&
                                <Link to={`/profile/${comment.tag._id}`} className="mr-1">
                                    {comment.tag.fullName} 
                                </Link>
                            }
                            <span>
                                {
                                    content.length < 100 ? content :
                                    readMore ? content + ' ' : content.slice(0, 100) + '....'
                                }
                            </span>
                            {
                                content.length > 100 &&
                                <span className="readMore" onClick={() => setReadMore(!readMore)}>
                                    {readMore ? 'Hide content' : 'Read more'}
                                </span>
                            }
                            </div>
                        }
                    

                        <div className='Comment_Content_Footer' style={{cursor: 'pointer'}}>
                            

                            <small className="font-weight-bold mr-3">
                                {comment.likes.length} likes
                            </small>

                            {
                                onEdit
                                ? <>
                                    <small className="font-weight-bold mr-3"
                                    onClick={handleUpdate}>
                                        Update
                                    </small>
                                    <small className="font-weight-bold mr-3"
                                    onClick={() => setOnEdit(false)}>
                                        Cancel
                                    </small>
                                    <div className="Emoji_Edit">
                                        <img src={Smile} style={{width:"25px", height:"25px"}} alt="" onClick={e => setEmojiOpened((prev) => !prev)}/>
                                        {emojiOpened ? <Picker onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_LIGHT}/> : ""}
                                    </div>
                                </>

                                : <small className="font-weight-bold mr-3"
                                onClick={handleReply}>
                                    {onReply ? 'Cancel' :'Reply'}
                                </small>
                            }
                            
                        </div>
                        
                    </div>


                    <div className="d-flex align-items-center Right_Part" style={{cursor: 'pointer'}}>
                        <CommentMenu post={post} comment={comment} setOnEdit={setOnEdit} />
                        <img 
                        src={isLike ? Heart : NotLike}
                        alt=""
                        style={{ cursor: "pointer", width:'30px'}}
                        onClick={isLike ? handleUnLike : handleLike} />
                    </div>
                </div> 
                
                {
                    onReply &&
                    <InputComment post={post} onReply={onReply} setOnReply={setOnReply} >
                        <Link to={`/profile/${onReply.user._id}`} className="mr-1">
                            @{onReply.user.username}:
                        </Link>
                    </InputComment>
                }

                {children}
            </div>
        }
    </>
  )
}

export default CommentCard