import { useMantineTheme } from '@mantine/core';
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { GLOBAL_TYPES } from '../../../../redux/actions/globalTypes';
import { getDataAPI } from '../../../../utils/fetchData';
import LoadIcon from '../../../../images/loading.gif';
import Delete from '../../../../images/backspace-arrow.png';
import Users from '../../../Users/Users';
import Search from '../../../../images/search.png'
import './Friends.css'
import { useEffect } from 'react';
import FriendsRequestModal from './FriendsRequestModal/FriendsRequestModal';

const Friends = () => {
    const {authData} = useSelector(state => state.auth)
    const { profile } = useSelector(state => state)
    const theme = useMantineTheme();
    const dispatch = useDispatch()
    const [onSearch, setOnSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(false)
    const ref = useRef(null);
    const [showNotice, setShowNotice] = useState(false)
    const [openFRModal, setOpenFRModal] = useState(false)

    const userData = authData.user;

    const handleClick = () => {
        ref.current.focus();
    };

    useEffect(() => {
        if (search.length === 0) {
            setShowNotice(false)
        }
    }, [search.length])

    const handleSearch = async (e) => {
        e.preventDefault()
        if(!search) return;

        try {
            setLoad(true)
            const res = await getDataAPI(`search?fullName=${search}`, authData.token)

            setUsers(res.data.users)
            setShowNotice(true)
            setLoad(false)
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }
  return (
    <div className='Friends'>
        
        <div className="Friends_Header">
            <h3 style={{fontWeight:'bold'}}>Friends</h3>
            <div>
                <button className='button' onClick={() => setOnSearch(prev => !prev)}><img src={Search} alt="Search" /></button>
                <button className='button' onClick={() => setOpenFRModal(true)}>Friends Request</button>
                <span>{userData.friendsWaitToAccept.length > 20 ? "20+" : userData.friendsWaitToAccept.length}</span>
                {openFRModal && <FriendsRequestModal openFRModal={openFRModal} setOpenFRModal={setOpenFRModal}/>}
            </div>
        </div>
        <div className="Friends_List">
            { userData.friends.map(user => (
                <Users key={user._id} user={user} location='Friends' />
            ))}
        </div>
        { onSearch && 
            <form action="" className='SearchForm' onSubmit={handleSearch}>
            <h5>Enter Name of user to search</h5>
            <div className='LogoSearch Header'>
                <div className="Search">
                    <label htmlFor="">
                        #Full Name: 
                        <input 
                            className='Search_Input' 
                            type='text' 
                            placeholder="Nguyen Van A"
                            onChange={e => setSearch(e.target.value)}
                            value={search}
                            required
                            ref={ref}
                        />
                    </label>
                    { search && 
                        <img src={Delete} alt="" onClick={() => {setSearch('');handleClick();}}/>
                    }
                </div>
            </div>
                    
            { load && <img className="loading" src={LoadIcon} alt="loading"  /> }
            <div className="users">
                {search.length > 0 && (( showNotice && users.length > 0) && <h6>Make friends to chat</h6>)}
                {search.length > 0 && (( showNotice && users.length === 0)  && <h6>{`No one has name: ${search}`}</h6>)}
                {
                    (users && showNotice) && users.map(user => (
                        <Users
                        key={user._id} 
                        user={user} 
                        border="border"
                        location="Friends"
                        />
                    ))
                }
            </div>
        </form>
        }   
    </div>
  )
}

export default Friends