import React, { useEffect, useRef, useState } from 'react'
import './Post.css'
import Comment from '../../../../../images/comment.png'
import Share from '../../../../../images/share.png'
import Heart from '../../../../../images/like.png'
import NotLike from '../../../../../images/notlike.png'
import Menu from '../../../../../images/menu.png'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { likePost, unLikePost } from '../../../../../redux/actions/postAction'
import { GLOBAL_TYPES } from '../../../../../redux/actions/globalTypes'
import { deletePost } from '../../../../../redux/actions/postAction'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BASE_URL } from '../../../../../utils/config'
import Carousel from '../../../../Carousel'
import Comments from './Comments/Comments'
import InputComment from './Comments/CommentDisplay/CommentCard/InputComment/InputComment'
import ShareModal from '../../../../ShareModal/ShareModal'

const Post = ({post, theme, user, location}) => {
  const {id} = useParams()
  const { socket } = useSelector(state => state)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {authData} = useSelector(state => state.auth)
  var guest
  if (id === authData.user._id) {
    guest = false
  } else guest = true

  const [readMore, setReadMore] = useState(false)

  const [isLike, setIsLike] = useState(false)
  const [loadLike, setLoadLike] = useState(false)
  const [onShare, setOnShare] = useState(false)

  const handleEditPost = () => {
    dispatch({ type: GLOBAL_TYPES.STATUS, payload: {...post, onEdit: true}})
  }

  const handleDeletePost = () => {
      if(window.confirm("Are you sure want to delete this post?")){
          dispatch(deletePost({post, authData, socket}))
          return navigate('/')
      }
  }

  const handleCopyLink = () => {
      navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
  }

  // console.log(post);
  useEffect(() => {
    if(post.likes.find(like => like._id === authData.user._id)){
        setIsLike(true)
    }else{
        setIsLike(false)
    }
  }, [post.likes, authData.user._id])

  const handleLike = async() => {
    if(loadLike) return;
    setLoadLike(true)
    await dispatch(likePost({post, authData, socket}))
    setLoadLike(false)
  };
  const handleUnLike = async () => {
    if(loadLike) return;
    setLoadLike(true)
    await dispatch(unLikePost({post, authData, socket}))
    setLoadLike(false)
  }
  // console.log(post.user);
  return (
    <div className='Post'>
        <div className="PostHeader">
          <div className='LeftPart'>
            { !guest 
              ? <img src={user[0].avatar} className="Avatar" alt=""/>
              : ( location === "home" 
                ? <img src={post.user.avatar} className="Avatar" alt=""/> 
                : <img src={user.avatar} className="Avatar" alt=""/>)
            }

            <div className="NameUser">
                <h6>
                    <Link to={`/profile/${guest ? (location === "home" ? post.user._id :user._id) : user[0]._id}`} className="text-dark">
                        {guest ? (location === "home" ? post.user.fullName :user.fullName) : user[0].fullName}
                    </Link>
                </h6>
                <small className="text-muted">
                    {moment(post.createdAt).fromNow()}
                </small>
            </div>
          </div>

          <div className="dropdown">
            <button className=" button p-button" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
              <img src={Menu} alt="" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
              {
                (!guest || authData.user._id === post.user._id) &&
                <>
                  <li><button className="dropdown-item" type="button"  onClick={handleEditPost}>Edit Post</button></li>
                  <li><button className="dropdown-item" type="button" onClick={handleDeletePost}>Remove Post</button></li>
                </>
              }
              <li><button className="dropdown-item" type="button" onClick={handleCopyLink}>Copy Link</button></li>
            </ul>
          </div>
        </div>
        <div className="Content">
          <span>
              {
                  post.content.length < 60 
                  ? post.content 
                  : readMore ? post.content + ' ' : post.content.slice(0, 60) + '.....'
              }
          </span>
          {
              post.content.length > 60 &&
              <span className="readMore" onClick={() => setReadMore(!readMore)} style={{cursor:"pointer",color:"blue"}}>
                  {readMore ? '  Hide content' : '  Read more'}
              </span>
          }
        </div>
        {
          post.images.length > 0 && <Link to={`/post/${post._id}`}><Carousel images={post.images} id={post._id} /></Link>
        }

        <div className="PostReact">
          <div className='Like'>
            {/* <Link to={`/post/${post._id}`}> */}
              <img 
                src={isLike ? Heart : NotLike}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={location === 'home' ? (isLike ? handleUnLike : handleLike) : undefined}
                
              />
            {/* </Link> */}
            <span style={ {color: "var(--gray)", fontSize: '12px'} }>
            {post.likes.length} {post.likes.length > 1 ? "likes" : "like"}
            </span>
          </div>
          <div className='Comment'>
            <img 
              src={Comment} alt="" 
              style={{ cursor: "pointer" }}
            />
            <span style={ {color: "var(--gray)", fontSize: '12px'} }>
              {post.comments.length} comments
            </span>
          </div>
          <div className='Share'>
            <img src={Share} alt="" onClick={location === 'home' ? (() => setOnShare(true)) : undefined}/>
          </div>
          <ShareModal url={`${BASE_URL}/post/${post._id}`} theme={theme} onShare={onShare} setOnShare={setOnShare}/>
        </div>

        <div className="Comments">
          { location === 'profile' 
          ? "" 
          : 
            <>
              <Comments post={post}/>
              <InputComment post={post}/>
            </>
          }
          
        </div>
    </div>
  )
}

export default Post