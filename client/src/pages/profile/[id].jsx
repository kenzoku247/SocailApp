import React, { useEffect, useState } from 'react'
import './profile.css'
import ProfileLeft from '../../components/Profile/ProfileLeft/ProfileLeft'
import ProfileCard from '../../components/Home/ProfileSide/ProfileCard/ProfileCard'
import PostSide from '../../components/Home/PostSide/PostSide'
import RightSide from '../../components/Home/RightSide/RightSide'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProfileUsers } from '../../redux/actions/profileAction'

const Profile = () => {
    const { profile } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    // console.log(profile);
    
    const dispatch = useDispatch()

    const { id } = useParams()
    const [saveTab, setSaveTab] = useState(false)

    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUsers({id, authData}))
        } 
    },[id, authData, dispatch, profile.ids])

    

  return (
    <div className='Profile'>
        <ProfileLeft />
        <div className="Profile-center">
          <ProfileCard ProfilePage={true} id ={id === undefined ? authData.user._id : id} profile={profile} dispatch={dispatch} authData={authData}/>
          <PostSide location={"profile"} id ={id} profile={profile} dispatch={dispatch} authData={authData}/>
        </div>
        <RightSide/>
    </div>
  )
}

export default Profile