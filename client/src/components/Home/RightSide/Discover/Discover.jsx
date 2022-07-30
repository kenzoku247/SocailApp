import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DISCOVER_TYPES, getDiscoverPosts } from '../../../../redux/actions/discoverAction'
import { getDataAPI } from '../../../../utils/fetchData'
import LoadIcon from '../../../../images/loading.gif'
import './Discover.css'
import PostThumb from './PostThumb/PostThumb'
import LoadMoreBtn from '../../../LoadMoreBtn'

const Discover = () => {

    const { discover } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    useEffect(() => {
        if(!discover.firstLoad){
            dispatch(getDiscoverPosts(authData.token))
        }
    },[dispatch, authData.token, discover.firstLoad])

    const handleLoadMore = async () => {
        setLoad(true)
        const res = await getDataAPI(`post_discover?num=${discover.page * 9}`, authData.token)
        dispatch({type: DISCOVER_TYPES.UPDATE_POST, payload: res.data})
        setLoad(false)
    }

  return (
    <div className='Discover'>
        <h3 style={{fontWeight:'bold'}}>Discover</h3>
        <h6>Some awesome photos from some users</h6>
        {
                discover.loading 
                ? <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4" />
                : <PostThumb posts={discover.posts} result={discover.result} />
            }

            {
                load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
            }

            {
                !discover.loading &&
                <LoadMoreBtn result={discover.result} page={discover.page}
                load={load} handleLoadMore={handleLoadMore} />
            }
    </div>
  )
}

export default Discover