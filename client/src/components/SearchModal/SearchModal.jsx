import React, { useRef, useState } from 'react'
import { Modal, useMantineTheme } from '@mantine/core';
import './SearchModal.css'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes';
import { useDispatch } from 'react-redux';
import { getDataAPI } from '../../utils/fetchData';
import LoadIcon from '../../images/loading.gif';
import Delete from '../../images/backspace-arrow.png';
import Users from '../Users/Users';
import { useEffect } from 'react';

const SearchModal = ({onSearch, setOnSearch, authData}) => {
    const theme = useMantineTheme();
    const dispatch = useDispatch()
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [load, setLoad] = useState(false)
    const ref = useRef(null);
    const [showNotice, setShowNotice] = useState(false)

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
    <Modal
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        size='55%'
        opened = {onSearch}
        onClose = {()=> {
            setOnSearch(false);
            setUsers([])
            setLoad(false)
            setSearch('')
        }}
    >
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
            {search.length > 0 && (( showNotice && users.length > 0) && <h6>Follow for awesome photos</h6>)}
            {search.length > 0 && (( showNotice && users.length === 0)  && <h6>{`No one has name: ${search}`}</h6>)}
            {
                (users && showNotice) && users.map(user => (
                    <Users
                    key={user._id} 
                    user={user} 
                    border="border"
                    />
                ))
            }
        </div>
    </form>
    </Modal>
  )
}

export default SearchModal