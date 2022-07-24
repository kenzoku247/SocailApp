import React, { useEffect, useState } from 'react'
import FollowersCard from '../../Home/ProfileSide/FollowersCard/FollowersCard'
import LogoSearch from '../../Home/ProfileSide/LogoSearch/LogoSearch'
import InfoCard from '../InfoCard/InfoCard'
import '../../Home/ProfileSide/ProfileSide.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const ProfileLeft = () => {
  const [saveTab, setSaveTab] = useState(false)
const { profile } = useSelector(state => state)
  const { authData } = useSelector(state => state.auth)
  // console.log(profile);
  
  const dispatch = useDispatch()

  const { id } = useParams()

  return (
    <div className='ProfileSide'>
        <LogoSearch/>
        <InfoCard key={id} authData={authData} profile={profile} dispatch={dispatch} id={id}/>
        { id === authData.user._id 
        ? <FollowersCard authData={authData} profile={profile} dispatch={dispatch} id={id}/>
        : ""
        }
        
    </div>
  )
}

export default ProfileLeft