import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PostSide from '../../components/Home/PostSide/PostSide'
import ProfileSide from '../../components/Home/ProfileSide/ProfileSide'
import RightSide from '../../components/Home/RightSide/RightSide'
import './Home.css'

const Home = () => {
  const { authData } = useSelector(state => state.auth)
  const { profile } = useSelector(state => state) 
  const dispatch = useDispatch()

  return (
    <div className='Home'>
        <ProfileSide className="ProfileSide"/>
        <PostSide className="PostSide" location = {"home"} authData={authData} profile={profile} dispatch={dispatch} id={authData.user._id}/>
        <RightSide className="RightSide"/>
    </div>
  )
}

export default Home