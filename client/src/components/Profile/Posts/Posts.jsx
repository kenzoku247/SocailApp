import React, { useState } from 'react'
import Post from '../../Home/PostSide/Posts/Post/Post'
import '../../Home/PostSide/Posts/Posts.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useParams } from "react-router-dom"
import LoadIcon from '../../../images/loading.gif'
import { getDataAPI } from '../../../utils/fetchData'
import { POST_TYPES } from '../../../redux/actions/postAction'
import LoadMoreBtn from '../../LoadMoreBtn'
import { PROFILE_TYPES } from '../../../redux/actions/profileAction'

const Posts = ({authData, profile, dispatch, id}) => {
    const [posts, setPosts] = useState([])
    const [userData, setUserData] = useState([])
    const [result, setResult] = useState(9)
    const [page, setPage] = useState(0)
    const [load, setLoad] = useState(false)
    // console.log(id);
    useEffect(() => {
        profile.posts.forEach(data => {
            // console.log(data._id);
            if(data._id === id){
                setPosts(data.posts)
                setResult(data.result)
                setPage(data.page)
            }
        })
    },[profile.posts, id])
    useEffect(() => {
        profile.users.forEach(data => {
            if(data._id === authData.user._id){
                setUserData([authData.user])
            }else{
                const newData = profile.users.find(user => user._id === data._id)
                setUserData(newData)
            }

        }

        )
    }, [id, authData, dispatch, profile.users])

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`user_posts/${id}?limit=${page * 9}`, authData.token)
        const newData = {...res.data, page: page + 1, _id: id}
        dispatch({type: PROFILE_TYPES.UPDATE_POST, payload: newData})
        setLoad(false)
  }
  return (
    <div className='Posts'>
      {
        posts.map(post => (
            <Post key={post._id} post={post} user={userData} location={"profile"}/>
        ))
      }
      {
        load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
      }

      <LoadMoreBtn result={result} page={page}
      load={load} handleLoadMore={handleLoadMore} />
    </div>
  )
}

export default Posts