import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import FollowersCard from './FollowersCard/FollowersCard'
import LogoSearch from './LogoSearch/LogoSearch'
import ProfileCard from './ProfileCard/ProfileCard'
import './ProfileSide.css'

const ProfileSide = ({refresh, setRefresh,location}) => {
  const { profile } = useSelector(state => state)
  const { authData } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const {_id} = authData.user
  const {id} = useParams()
  return (
    <div className='ProfileSide'>
        <LogoSearch refresh={refresh} setRefresh={setRefresh} location={location}/>
        <ProfileCard key={ id } ProfilePage={false} id ={_id} profile={profile} authData={authData} dispatch={dispatch}/>
        <FollowersCard authData={authData}/>
    </div>
  )
}

export default ProfileSide