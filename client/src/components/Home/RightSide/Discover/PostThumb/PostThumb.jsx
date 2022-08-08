import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './PostThumb.css'
import Heart from '../../../../../images/like.png'
import Comment from '../../../../../images/comment.png'

const PostThumb = ({posts, result, location}) => {
    const { theme } = useSelector(state => state)

    if(result === 0) return <h2 className="text-center text-danger">No Post</h2>

    return (
        <div className="post_thumb">
            {
                posts.map(post => (
                    <Link key={post._id} to={`/post/${post._id}`}>
                        <div className="post_thumb_display">

                            {
                                post.images[0].url.match(/video/i)
                                ?<video controls src={post.images[0].url} alt={post.images[0].url}
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />

                                :<img src={post.images[0].url} alt={post.images[0].url}
                                style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
                            }

                            {location === "saved" &&
                                <div className="post_thumb_menu">
                                    <div className="NoHeart">
                                        <span>{post.likes.length}</span>
                                        <img src={Heart} alt="" style={{height:'20px',width:'20px'}}/>
                                    </div>
                                    <div className="NoComment">
                                        <span>{post.comments.length}</span>
                                        <img src={Comment} alt="" style={{height:'20px',width:'20px'}}/>
                                    </div>
                                </div>
                            }
                        </div>
                    </Link>
                ))
            }
        </div>
    )
}

export default PostThumb
