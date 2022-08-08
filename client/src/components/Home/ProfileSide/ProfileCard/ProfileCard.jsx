import React, { useEffect } from "react";
import "./ProfileCard.css";
import { useSelector, useDispatch } from 'react-redux'
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import FollowersModal from "../../../FollowersModal/FollowersModal";
import FollowingsModal from "../../../FollowingsModal/FollowingsModal";
import { GLOBAL_TYPES } from "../../../../redux/actions/globalTypes";

const ProfileCard = ({ProfilePage, id, profile,dispatch, authData, location}) => {
  const [userData, setUserData] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowings, setShowFollowings] = useState(false)
  const [no_posts, setNo_posts] = useState({})

  useEffect(() => {
    if(id === authData.user._id){
        setUserData([authData.user])
    }else{
        const newData = profile.users.filter(user => user._id === id)
        setUserData(newData)
        
    }
  }, [id, authData, dispatch, profile.users, ])

  useEffect(() => {
    if (ProfilePage) {
      setNo_posts(profile.posts.filter(post => post._id === id))
      
    }
  },[id,profile.posts, ProfilePage])
  useEffect(() => {
    if(showFollowers || showFollowings){
        dispatch({ type: GLOBAL_TYPES.MODAL, payload: true})
    }else{
        dispatch({ type: GLOBAL_TYPES.MODAL, payload: false})
    }
  },[showFollowers, showFollowings, dispatch]) 
  return (
    userData.map(user => (
      <div key={user._id} className="ProfileCard">
        <div className="ProfileImages">
          <img src={user.backgroundCover} alt="" />
          <img src={user.avatar} alt="" />
        </div>

        <div className="ProfileName">
          <span>{user.fullName}</span>
          <span>{user.story}</span>
        </div>

        <div className="followStatus">
          <hr />
          <div>
            <div className="Follow">
              <span>{user.followings.length}</span>
              <span onClick={() => setShowFollowings(true)} style={{cursor:"pointer"}}>
                {user.followings.length > 1 ? "Followings" : "Following"}
              </span>
            </div>
            <div className="Vl"></div>
            <div className="Follow">
              <span>{user.followers.length}</span>
              <span onClick={() => setShowFollowers(true)} style={{cursor:"pointer"}}>
                {user.followers.length > 1 ? "Followers" : "Follower"}
              </span>
            </div>

            { 
              location !== "saved" 
              ? (ProfilePage && (
                <>
                  <div className="Vl"></div>
                  <div className="Follow">
                    <span>{no_posts[0] ? no_posts[0].posts.length : ""}</span>
                    <span>{no_posts[0] ? (no_posts[0].posts.length > 1 ? "Posts" : "Post") : ""}</span>
                  </div>
                </>
              ))
              : (
                <>
                  <div className="Vl"></div>
                  <div className="Follow">
                    <span>{authData.user.saved.length}</span>
                    <span>{authData.user.saved.length > 1 ? "Saved Posts" : "Saved Post"}</span>
                  </div>
                </>
              )
          }
          </div>
          <hr />
        </div>
        {
          ProfilePage ? 
          "" : 
          <span>
            <Link to={`/profile/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
              My Profile
            </Link>
          </span>
        }
        {
          showFollowers &&
          <FollowersModal 
          users={user.followers} 
          showFollowers = {showFollowers}
          setShowFollowers={setShowFollowers} 
          />
        }
        {
          showFollowings &&
          <FollowingsModal 
          users={user.followings} 
          showFollowings = {showFollowings}
          setShowFollowings={setShowFollowings} 
          />
        }
      </div>
    ))
  );
};

export default ProfileCard;