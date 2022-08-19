import React, { useEffect, useState } from 'react'
import { deletePost } from '../../redux/actions/adminAction'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'
import { getAdminDataAPI } from '../../utils/fetchData'
import { imageShow, videoShow } from '../../utils/mediaShow'
import './Admin.css'
import Sort from '../../images/sort.png'

const PostManager = ({admin, dispatch, authData, socket}) => {

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [readMore, setReadMore] = useState(false)
    const [posts, setPosts] = useState([])
    const [sortUsers, setSortUsers] = useState(false)
    const [sortLikes, setSortLikes] = useState(false)
    const [sortComments, setSortComments] = useState(false)

    useEffect(() => {
        if (search.length === 0) {
            setUsers([])
        }
    }, [search.length])

    const handleSortUsers = () => {
        if (sortUsers) {
            admin.posts = admin.posts.sort((a, b) => b.user.replace(/[a-z]/g, '') - a.user.replace(/[a-z]/g, ''))
        } else {
            admin.posts = admin.posts.sort((a, b) => a.user.replace(/[a-z]/g, '') - b.user.replace(/[a-z]/g, ''))
        }
        setSortUsers(!sortUsers)
    }

    const handleSortLikes = () => {
        if (sortLikes) {
            admin.posts = admin.posts.sort((a, b) => b.likes.length - a.likes.length)
        } else {
            admin.posts = admin.posts.sort((a, b) => a.likes.length - b.likes.length)
        }
        setSortLikes(!sortLikes)
    }

    const handleSortComments = () => {
        if (sortComments) {
            admin.posts = admin.posts.sort((a, b) => b.comments.length - a.comments.length)
        } else {
            admin.posts = admin.posts.sort((a, b) => a.comments.length - b.comments.length)
        }
        setSortComments(!sortComments)
    }

    const handleAddPost = (id) => {
        if (posts.includes(id))
            {
                setPosts(posts.filter(post => post !== id))
            }
        else {
            setPosts([...posts, id])
        }
    }

    const handleDeletePost = (id) => {
        if(window.confirm('Do you want to delete this post?')){
            dispatch(deletePost({id,admin,authData}))
        }
    }

    const handleDeletePosts = (posts) => {
        if(window.confirm('Do you want to delete these post?')){
            posts.map(post => dispatch(deletePost({id: post,admin,authData})))
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const res = await getAdminDataAPI(`search?fullName=${search}` , authData.token)
            setUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }
  return (
    <div className='PostManager'>
        <h3>Manager Posts</h3>
        <div className="PostList">
            <div className="PostListHeader">
                <h5>Posts list</h5>
                <form action="" onSubmit={handleSearch}>
                    <input 
                        className='input-search' 
                        type='text' 
                        placeholder='Search User'
                        onChange={e => setSearch(e.target.value)}
                        value={search}
                    />
                </form>
                {posts.length > 0 && 
                <button className='button' onClick={() => handleDeletePosts(posts)}>Delete Selected Posts</button>}
            </div>
            <div className="PostListField">
                <div className="FieldPostName">
                    <h6></h6>
                    <div className="SortContent">
                        <h6>User</h6>
                        <img 
                            src={Sort} 
                            alt="" 
                            className='SortIcon' 
                            onClick={handleSortUsers}
                            style={{"cursor":"pointer"}}
                        />
                    </div>
                    <h6>Content</h6>
                    <h6>Images</h6>
                    <div className="SortContent">
                        <h6>Likes</h6>
                        <img 
                            src={Sort} 
                            alt="" 
                            className='SortIcon' 
                            onClick={handleSortLikes}
                            style={{"cursor":"pointer"}}
                        />
                    </div><div className="SortContent">
                        <h6>Comments</h6>
                        <img 
                            src={Sort} 
                            alt="" 
                            className='SortIcon' 
                            onClick={handleSortComments}
                            style={{"cursor":"pointer"}}
                        />
                    </div>
                    
                    <h6>Modify</h6>
                </div>
                <div className="InfoPost">
                    { (search.length > 0 && users.length > 0) 
                        ? users.map(user => admin.posts.filter(post => post.user === user._id).map(data =>
                            <div key={data._id}>
                                <div style={{"display":"flex","justifyContent":"center","alignItems":"center"}}>
                                    <input type="checkbox" name="" id="" onClick={() => handleAddPost(data._id)}/>
                                </div>
                                <h6>{admin.users.find(user => user._id === data.user).fullName}</h6>
                                <h6 style={{"textAlign":"justify"}}>
                                    {
                                    data.content.length < 24 
                                    ? data.content 
                                    : readMore ? data.content + ' ' : data.content.slice(0, 24) + '...'
                                    }
                                    {
                                        data.content.length >= 24 &&
                                        <span className="readMore" onClick={() => setReadMore(!readMore)} style={{cursor:"pointer",color:"blue"}}>
                                            {readMore ? '  Hide content' : '  Read more'}
                                        </span>
                                    }
                                </h6>
                                <div className="ImagesPost">
                                    {data.images.map((image, index) => (
                                        <div  key={index} id="file_img">
                                        {
                                            image.camera 
                                            ? imageShow(image.camera)
                                            : image.url
                                            ?<>
                                                {
                                                    image.url.match(/video/i)
                                                    ? videoShow(image.url) 
                                                    : imageShow(image.url)
                                                }
                                            </>
                                            :<>
                                                {
                                                    image.type.match(/video/i)
                                                    ? videoShow(URL.createObjectURL(image)) 
                                                    : imageShow(URL.createObjectURL(image))
                                                }
                                            </>
                                        }
                                        </div>
                                    ))}
                                </div>
                                <h6 style={{"justifyContent":"center"}}>{data.likes.length}</h6>
                                <h6 style={{"justifyContent":"center"}}>{data.comments.length}</h6>
                                <button className='button' onClick={() => handleDeletePost(data._id)}>Delete</button>
                            </div>
                        ))
                        : admin.posts.map(post => 
                            <div key={post._id}>
                                <div style={{"display":"flex","justifyContent":"center","alignItems":"center"}}>
                                    <input type="checkbox" name="" id="" onClick={() => handleAddPost(post._id)}/>
                                </div>
                                <h6>{admin.users.find(user => user._id === post.user).fullName}</h6>
                                <h6 style={{"textAlign":"justify"}}>
                                    {
                                    post.content.length < 24 
                                    ? post.content 
                                    : readMore ? post.content + ' ' : post.content.slice(0, 24) + '...'
                                    }
                                    {
                                        post.content.length > 24 &&
                                        <span className="readMore" onClick={() => setReadMore(!readMore)} style={{cursor:"pointer",color:"blue"}}>
                                            {readMore ? '  Hide content' : '  Read more'}
                                        </span>
                                    }
                                </h6>
                                <div className="ImagesPost">
                                    {post.images.map((image, index) => (
                                        <div key={index} id="file_img">
                                        {
                                            image.camera 
                                            ? imageShow(image.camera)
                                            : image.url
                                            ?<>
                                                {
                                                    image.url.match(/video/i)
                                                    ? videoShow(image.url) 
                                                    : imageShow(image.url)
                                                }
                                            </>
                                            :<>
                                                {
                                                    image.type.match(/video/i)
                                                    ? videoShow(URL.createObjectURL(image)) 
                                                    : imageShow(URL.createObjectURL(image))
                                                }
                                            </>
                                        }
                                        </div>
                                    ))}
                                </div>
                                <h6 style={{"justifyContent":"center"}}>{post.likes.length}</h6>
                                <h6 style={{"justifyContent":"center"}}>{post.comments.length}</h6>
                                <button className='button' onClick={() => handleDeletePost(post._id)}>Delete</button>
                            </div>
                        )
                    }  
                </div>
            </div>
        </div>
    </div>
  )
}

export default PostManager