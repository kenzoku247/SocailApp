import React, { useEffect, useState } from 'react'
import '../profile/profile.css'
import ProfileLeft from '../../components/Profile/ProfileLeft/ProfileLeft'
import ProfileCard from '../../components/Home/ProfileSide/ProfileCard/ProfileCard'
import RightSide from '../../components/Home/RightSide/RightSide'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getProfileUsers } from '../../redux/actions/profileAction'
import PostThumb from '../../components/Home/RightSide/Discover/PostThumb/PostThumb'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../../components/LoadMoreBtn'

const Saved = () => {
    const { profile } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const { id } = useParams()
    const [savePosts, setSavePosts] = useState([])
    const [result, setResult] = useState(8)
    const [page, setPage] = useState(2)
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(profile.ids.every(item => item !== id)){
            dispatch(getProfileUsers({id, authData}))
        } 
    },[id, authData, dispatch, profile.ids])

    useEffect(() => {
      setLoad(true)
      getDataAPI('getSavePosts', authData.token)
      .then(res => {
          setSavePosts(res.data.savePosts)
          setResult(res.data.result)
          setLoad(false)
      })
      .catch(err => {
          dispatch({type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}})
      })

      return () => setSavePosts([])
  },[authData.token, dispatch])

  const handleLoadMore = async () => {
      setLoad(true)
      const res = await getDataAPI(`getSavePosts?limit=${page * 8}`, authData.token)
      setSavePosts(res.data.savePosts)
      setResult(res.data.result)
      setPage(page + 1)
      setLoad(false)
  }

  return (
    <div className='Profile'>
        <ProfileLeft />
        <div className="Profile-center">
          <ProfileCard ProfilePage={true} id ={id === undefined ? authData.user._id : id} profile={profile} dispatch={dispatch} authData={authData} location="saved"/>
          <PostThumb posts={savePosts} result={result} location="saved"/>
          {
            load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
          }

          <LoadMoreBtn result={result} page={page}
          load={load} handleLoadMore={handleLoadMore} />
        </div>
        <RightSide/>
    </div>
  )
}

export default Saved