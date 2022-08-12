import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADMIN_TYPES, deleteUser, getAllUsers, logout, setRole } from '../../redux/actions/adminAction'
import UserManager from './UserManager'

const Manager = () => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('Dashboard')
    const [openManagerUser, setOpenManagerUsers] = useState(false)
    const [openManagerPosts, setOpenManagerPosts] = useState(false)
    const { authData } = useSelector(state => state.auth)
    const { admin, socket } = useSelector(state => state)
    

    const handleLogout = () => {
        dispatch(logout())
    }

    useEffect(() => {
            dispatch(getAllUsers({authData}))
    },[title, dispatch, authData, admin.loading])


    
  return (
    <div className='Manager'>
        <div className="NavbarManager">
            <h1>Admin</h1>
            <button onClick={handleLogout}>
                Logout
            </button>
        </div>
        <div className="BodyManager">
            <div className='RightManager'>
                <div className="ButtonRight">
                    <button>Hide Menu</button>
                    <button onClick={() => (
                        setOpenManagerUsers(false),
                        setOpenManagerPosts(false),
                        setTitle('Dashboard')
                        )}>
                        Dashboard
                    </button>
                    <button onClick={() => (
                        setOpenManagerUsers(true),
                        setOpenManagerPosts(false),
                        setTitle('Manager Users')
                        )}>
                        Manager Users
                    </button>
                    <button onClick={() => (
                        setOpenManagerUsers(false),
                        setOpenManagerPosts(true),
                        setTitle('Manager Posts')
                    )}>Manager Posts</button>
                </div>


            </div>
            <div className="LeftManager">
                <div className="ManagerHeader"> 
                    {title === "Manager Users" && <UserManager admin={admin} dispatch={dispatch} authData={authData} socket={socket}/>}
                </div>
            </div>
        </div>
            
    </div>
  )
}

export default Manager