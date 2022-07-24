import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addFriend, follow, unFollow, unFriend } from '../../redux/actions/profileAction';

import './Users.css'

const Users = ({user, setShowFollowers, setShowFollowings, location}) => {
  const [followed, setFollowed] = useState(false)
  const [friended, setFriended] = useState(false)
  const [load, setLoad] = useState(false)
  const dispatch = useDispatch()
  const { profile, socket } = useSelector(state => state)
  const { authData } = useSelector(state => state.auth)
  // console.log(profile.users, user);

  useEffect(() => {
    if(authData.user.followings.find(item => item._id === user._id)){
        setFollowed(true)
    }
    return () => setFollowed(false)
  }, [authData.user.followings, user._id])

  useEffect(() => {
    if(authData.user.friends.find(item => item._id === user._id)){
        setFriended(true)
    }
    return () => setFriended(false)
  }, [authData.user.friends, user._id])

  
  
  
  const handleFollow = async () => {
    if(load) return
    setFollowed(true)
    setLoad(true)

    await dispatch(follow({users: profile.users, user, authData, socket}))
    setLoad(false)
  }
  const handleUnFollow = async () => {
    if(load) return
    setFollowed(false)
    setLoad(true)
    await dispatch(unFollow({users: profile.users, user, authData, socket}))
    setLoad(false)
  }

  const handleAddFriend = async () => {
    if(load) return
    setFriended(true)
    setLoad(true)
    
    await dispatch(addFriend({users: profile.users, user, authData, socket}))
    setLoad(false)
  }

  const handleUnFriend = async () => {
    if(load) return
    setFriended(false)
    setLoad(true)
    await dispatch(unFriend({users: profile.users, user, authData, socket}))
    setLoad(false)
  }
  return (
    <div className="follower">
        <div>
          <img src={
              user.avatar
          } alt="" className='followerImage'/>
          <div className="Name">
              <Link to={`/profile/${user._id}`} onClick={() => {setShowFollowers(false);setShowFollowings(false)}}>
                <span>
                  {user.fullName}
                </span>
              </Link>
              <span >
                @{user.username}
              </span>
          </div>
        </div>
        {
            user._id !== authData.user._id ?
            ( location === "Friends" 
              ? (friended
                ? (<button className="button fc-button UnfollowButton"
                  onClick={handleUnFriend}>
                  UnFriend
                </button>)
                : <button className="button fc-button"
                  onClick={handleAddFriend}>
                  Add Friend
                </button>)
              : (followed
                ? (<button className="button fc-button UnfollowButton"
                  onClick={handleUnFollow}>
                  UnFollow
                </button>)
                : <button className="button fc-button"
                  onClick={handleFollow}>
                  Follow
                </button>)
            )
            : ""
        }
    </div>
  )
}

export default Users