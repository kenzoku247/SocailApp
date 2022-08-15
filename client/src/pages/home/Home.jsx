import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PostSide from '../../components/Home/PostSide/PostSide'
import ProfileSide from '../../components/Home/ProfileSide/ProfileSide'
import RightSide from '../../components/Home/RightSide/RightSide'
import './Home.css'

const Home = () => {
  const { authData } = useSelector(state => state.auth)
  const { profile } = useSelector(state => state) 
  const dispatch = useDispatch()

  const [refresh, setRefresh] = useState(false)
  console.log(refresh);

  return (
    <div className='Home'>
        <ProfileSide className="ProfileSide" setRefresh={setRefresh} location="home"/>
        <PostSide className="PostSide" refresh={refresh} setRefresh={setRefresh} location = {"home"} authData={authData} profile={profile} dispatch={dispatch} id={authData.user._id}/>
        <RightSide className="RightSide"/>
    </div>
  )
}

export default Home