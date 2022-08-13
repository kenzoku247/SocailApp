import React from 'react'
import PostShare from './PostShare/PostShare'
import PostsHome from './Posts/Posts'
import PostsProfile from '../../Profile/Posts/Posts'
import './PostSide.css'

const PostSide = ({refresh, setRefresh, location, authData, profile, dispatch, id}) => {

  const followed = authData.user.followings.find(follow => follow._id === id)
  // console.log(followed);


  return (
    <div className='PostSide'>
      { id === authData.user._id 
      ? <PostShare/>
      : ""
      }
      {
        location === "home" ?
        <PostsHome refresh={refresh} setRefresh={setRefresh} />
        : (
          id === authData.user._id 
          ? <PostsProfile authData={authData} profile={profile} dispatch={dispatch} id={id}/>
          :(
            followed === undefined 
            ? "Nothing here. Follow for more!"
            : <PostsProfile authData={authData} profile={profile} dispatch={dispatch} id={id}/>
            )
          )
      }
    </div>
  )
}

export default PostSide