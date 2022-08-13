import React, { useState } from 'react'
import Post from './Post/Post'
import './Posts.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import LoadIcon from '../../../../images/loading.gif'
import { getDataAPI } from '../../../../utils/fetchData'
import { getPosts, POST_TYPES } from '../../../../redux/actions/postAction'
import LoadMoreBtn from '../../../LoadMoreBtn'
import Loading from '../../../../images/loading.gif'

const Posts = ({refresh, setRefresh}) => {
  const { authData } = useSelector(state => state.auth)
  const { posts, theme } = useSelector(state => state)
  const dispatch = useDispatch()
  const [load, setLoad] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if(refresh) {
      setLoading(true)
      dispatch(getPosts(authData.token))
    }
    setRefresh(false)
    setTimeout(() => setLoading(false),1000)
  },[authData.token, dispatch, refresh, setRefresh])


  const handleLoadMore = async () => {
      setLoad(true)
      const res = await getDataAPI(`posts?limit=${posts.page * 8}`, authData.token)

      dispatch({
          type: POST_TYPES.GET_POSTS, 
          payload: {...res.data, page: posts.page + 1}
      })

      setLoad(false)
  }

  return (
    <div className='Posts'>
      {loading 
      ? <div><img src={Loading} alt=""/></div>
      :
      (
        posts.posts.map(post => (
            <Post key={post._id} post={post} theme={theme} location={"home"}/>
        ))
        
      )
      }
      {load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />}
      {!loading && <LoadMoreBtn result={posts.result} page={posts.page}
      load={load} handleLoadMore={handleLoadMore} />}
    </div>
  )
}

export default Posts