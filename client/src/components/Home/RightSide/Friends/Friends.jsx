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

const Friends = () => {
    const {authData} = useSelector(state => state.auth)
    const { profile } = useSelector(state => state)
    const theme = useMantineTheme();
    const dispatch = useDispatch()
    const [onSearch, setOnSearch] = useState(false)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [label, setLabel] = useState('#Username: ')
    const [placeholder, setPlaceholder] = useState('username')
    const [type, setType] = useState('username')
    const [load, setLoad] = useState(false)
    const ref = useRef(null);
    const [showNotice, setShowNotice] = useState(false)

    const userData = authData.user;

    const handleClick = () => {
        ref.current.focus();
    };

    useEffect(() => {
        if (search.length === 0) {
            setShowNotice(false)
        }
    }, [search.length])

    const handleChange = (e) => {
        setType(e.target.value)
        setSearch('');
        setUsers([])
    }

    const handleSearch = async (e) => {
        e.preventDefault()
        if(!search) return;

        try {
            setLoad(true)
            let res
            if (type === 'username') {
                res = await getDataAPI(`searchU?${type}=${search}`, authData.token)
            } else if (type === 'fullName') {
                res = await getDataAPI(`searchF?${type}=${search}`, authData.token)
            } else {
                res = await getDataAPI(`searchE?${type}=${search}`, authData.token)
            }
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
            <h5>Friends</h5>
            <img src={Search} alt="" onClick={() => setOnSearch(prev => !prev)}/>
        </div>
        <div className="Friends_List">
            { userData.friends.map(user => (
                <Users key={user._id} user={user} location='Friends' />
            ))}
        </div>
        { onSearch && 
            <form action="" className='SearchForm' onSubmit={handleSearch}>
            <h5>Choose a category below to search</h5>
            <div className='LogoSearch Header'>
                <div className="Search">
                    <label htmlFor="">
                        {label}
                        <input 
                            className='Search_Input' 
                            type='text' 
                            placeholder={placeholder}
                            onChange={e => {
                                if (type === 'username' || type === 'email') {
                                    setSearch(e.target.value.toLowerCase().replace(/ /g, ''))
                                } else {
                                    setSearch(e.target.value)
                                }
                            }}
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
            <div className="Type_1">
            <label htmlFor ='username'>
                Username   
                <input type="radio" 
                id='username' 
                className = "radioInput"
                name='type' 
                value ="username"
                defaultChecked
                onClick={() => {handleClick();setLabel('#Username: ');setPlaceholder('username')}}
                onChange={handleChange}
                />
            </label>
                
            <label htmlFor ='fullName'>
                Full Name
                <input type="radio" 
                id='fullName' 
                className = "radioInput"
                name='type' 
                value ="fullName"
                onClick={() => {handleClick();setLabel('#Full Name: ');setPlaceholder('Young Woo')}}
                onChange={handleChange}
                />
            </label>

            <label htmlFor ='email'>
                Email 
                <input type="radio" 
                id='email' 
                className = "radioInput"
                name='type' 
                value ="email"
                onClick={() => {handleClick();setLabel('#Email: ');setPlaceholder('email@example.com')}}
                onChange={handleChange}
                />
            </label>
            </div>
                    
            { load && <img className="loading" src={LoadIcon} alt="loading"  /> }
            <div className="users">
                {search.length > 0 && (( showNotice && users.length > 0) && <h6>Make friends to chat</h6>)}
                {search.length > 0 && (( showNotice && users.length === 0)  && <h6>{`No one has ${type}: ${search}`}</h6>)}
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