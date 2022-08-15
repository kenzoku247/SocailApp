import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelFriendsRequest } from '../../../../../../redux/actions/profileAction';
import { getDataAPI } from '../../../../../../utils/fetchData';

import './FriendsRequest.css'

const FriendsRequest = ({user, setShowFollowers, setShowFollowings, location}) => {
  const dispatch = useDispatch()
  const { profile, socket } = useSelector(state => state)
  const { authData } = useSelector(state => state.auth)
  const [newUser, setNewUser] = useState({})
    useEffect( () => {
        if (!user._id) {
            const fetchData = async () => {
                const res = await getDataAPI(`/user/${user}`, authData.token)
                setNewUser(res.data.user)
            }
            fetchData()
        } else setNewUser(user)
    },[authData.token, user])
    console.log(newUser);
  const handleCancelRequest = async () => {
    await dispatch(cancelFriendsRequest({users: profile.users,user: newUser, authData, socket}))
  }

  return (
    <div className="FriendsRequest">
        <div className='InfoRequest'>
          <img src={newUser.avatar} alt="" className='followerImage' style={{border: "1px solid #555"}}/>
          <div className="Name">
              <Link to={`/profile/${newUser._id}`} onClick={() => {setShowFollowers(false);setShowFollowings(false)}}>
                <span>
                  {newUser.fullName}
                </span>
              </Link>
              <span >
                @{newUser.username ? (newUser.username.length > 10 ? newUser.username.slice(0,10) + "..." : newUser.username) : newUser.username}
              </span>
          </div>
        </div>
        <div className='ButtonResponse'>
          <button className="button fc-button UnfollowButton" >
              Waiting to Accept
          </button>
          <button className="button fc-button"
              onClick={handleCancelRequest}>
              Cancel Request
          </button>
        </div>
    </div>
  )
}

export default FriendsRequest