import React, { useEffect, useState } from 'react'
import FollowersCard from '../../Home/ProfileSide/FollowersCard/FollowersCard'
import LogoSearch from '../../Home/ProfileSide/LogoSearch/LogoSearch'
import InfoCard from '../InfoCard/InfoCard'
import '../../Home/ProfileSide/ProfileSide.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { cancelFriendsRequest, follow, friendRequest, unFollow, unFriend } from '../../../redux/actions/profileAction'

const ProfileLeft = () => {
const { profile } = useSelector(state => state)
  const { authData } = useSelector(state => state.auth)
  const { socket } = useSelector(state => state)
  
  const dispatch = useDispatch()

  const [followed, setFollowed] = useState(false)
  const [waitToAccept, setWaitToAccept] = useState(false)
  const [friended, setFriended] = useState(false)
  const [load, setLoad] = useState(false)
  const [userData, setUserData] = useState([])

  const { id } = useParams()

  useEffect(() => {
    if(id === authData.user._id){
        setUserData([authData.user])
    }else{
        const newData = profile.users.filter(user => user._id === id)
        if (newData.length === 2) {
          if (JSON.stringify(newData[0]) === JSON.stringify(newData[1])) {
            newData.pop()
          }
        }
        setUserData(newData)
    }
  }, [id, authData, dispatch, profile.users])

  

  useEffect(() => {
    if (userData[0]) {
      
      if(authData.user.followings.find(item => item._id === userData[0]._id)){
          setFollowed(true)
      }
      else {
        setFollowed(false)
      }
    }
  }, [authData.user.followings, userData])

  useEffect(() => {
    if (userData[0]) {
      if(authData.user.friends.find(item => item._id === userData[0]._id)){
          setFriended(true)
      } else {
        setFriended(false)
      }
    }
  }, [authData.user.friends, userData])

  useEffect(() => {
    if (userData[0]) {
      if(authData.user.friendsRequest.find(item => item === userData[0]._id)){
          setWaitToAccept(true)
      } else {
        setWaitToAccept(false)
      }
    }
  }, [authData.user.friendsRequest, userData])

  const handleFollow = async () => {
    if(load) return
    setFollowed(true)
    setLoad(true)

    await dispatch(follow({users: profile.users, user: userData[0], authData, socket}))
    setLoad(false)
  }
  const handleUnFollow = async () => {
    if(load) return
    setFollowed(false)
    setLoad(true)
    await dispatch(unFollow({users: profile.users, user: userData[0], authData, socket}))
    setLoad(false)
  }

  const handleAddFriend = async () => {
    if(load) return
    setLoad(true)
    await dispatch(friendRequest({users: profile.users, user: userData[0], authData, socket}))
    setWaitToAccept(true)
    setLoad(false)
  }

  const handleUnFriend = async () => {
    if(load) return
    setFriended(false)
    setLoad(true)
    await dispatch(unFriend({users: profile.users, user: userData[0], authData, socket}))
    setLoad(false)
  }

  const handleCancelRequest = async () => {
    await dispatch(cancelFriendsRequest({users: profile.users,user: userData[0], authData, socket}))
    setWaitToAccept(false)
  }

  return (
    <div className='ProfileSide'>
        <LogoSearch location="profile"/>
        <InfoCard key={id} authData={authData} profile={profile} dispatch={dispatch} id={id}/>
        { id === authData.user._id 
        ? <FollowersCard location="profile" authData={authData} profile={profile} dispatch={dispatch} id={id}/>
        : <div className='ActionButton'>
            <div className="AddFriendButton">
              <h5>Add Friend</h5>
                {!friended
                ? (waitToAccept 
                  ? 
                    <div className='Waiting'>
                      <button className="button fc-button UnfollowButton" >
                          Waiting to Accept
                      </button><x></x>
                      <button className="button fc-button"
                          onClick={handleCancelRequest}>
                          Cancel Request
                      </button>
                    </div>
                  : <button className="button fc-button"
                    onClick={handleAddFriend} style={{height:""}}>
                    Add Friend
                    </button> 
                    )
                : <button className="button fc-button UnfollowButton"
                    onClick={handleUnFriend}>
                    UnFriend
                  </button>}
            </div>
            <div className="FollowButton">
              <h5>Follow</h5>
              {followed
                  ? (<button className="button fc-button UnfollowButton"
                    onClick={handleUnFollow}>
                    UnFollow
                  </button>)
                  : <button className="button fc-button"
                    onClick={handleFollow}>
                    Follow
                  </button>}
            </div>
          </div>
        }
        
    </div>
  )
}

export default ProfileLeft