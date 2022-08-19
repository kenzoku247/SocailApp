import React, { useEffect, useState } from 'react'
import '../home/Home.css'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getPost } from '../../redux/actions/postAction'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../../components/LoadMoreBtn'
import Post from '../../components/Home/PostSide/Posts/Post/Post'
import ProfileSide from '../../components/Home/ProfileSide/ProfileSide'
import RightSide from '../../components/Home/RightSide/RightSide'

const Profile = () => {
    const { id } = useParams()
    const [post, setPost] = useState([])

    const { detailPost } = useSelector(state => state)
    const { authData } =useSelector(state => state.auth)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPost({detailPost, id, authData}))

        if(detailPost.length > 0){
            const newArr = detailPost.filter(post => post._id === id)
            // console.log(newArr);
            if (newArr.length > 1){
                setPost(Array(newArr[0]))
            } else {

                setPost(newArr)
            }
        }
    },[detailPost, dispatch, id, authData])
    // console.log(post);
  return (
    <div className="Home">
        <ProfileSide location="profile"/>
        {
            post.length === 0 &&
            <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
        }

        {
            post.map(item => (
                <Post key={item._id} post={item} location={'home'}/>
            ))
        }
        <RightSide/>
    </div>
  )
}

export default Profile