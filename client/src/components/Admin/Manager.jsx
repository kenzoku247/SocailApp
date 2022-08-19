import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADMIN_TYPES, deleteUser, getAllFeedbacks, getAllPosts, getAllUsers, logout, setRole } from '../../redux/actions/adminAction'
import Dashboard from './Dashboard'
import FeedbackManager from './FeedbackManager'
import PostManager from './PostManager'
import UserManager from './UserManager'

const Manager = () => {

    const dispatch = useDispatch()
    const [title, setTitle] = useState('Dashboard')
    const { authData } = useSelector(state => state.auth)
    const { admin, socket } = useSelector(state => state)
    

    const handleLogout = () => {
        dispatch(logout())
    }

    useEffect(() => {
            dispatch(getAllUsers({authData}))
    },[title, dispatch, authData, admin.loading])

    useEffect(() => {
        dispatch(getAllPosts({authData}))
    },[title, dispatch, authData, admin.loading])

    useEffect(() => {
        dispatch(getAllFeedbacks({authData}))
    },[title, dispatch, authData, admin.loading])
    
  return (
    <div className='Manager'>
        <div className="NavbarManager">
            <h1 style={{"fontFamily": "Georgia, serif"}}>Admin</h1>
            <button className='button' onClick={handleLogout}>
                Logout
            </button>
        </div>
        <div className="BodyManager">
            <div className='RightManager'>
                <div className="ButtonRight">
                    <button onClick={() => (
                        setTitle('Dashboard')
                        )}>
                        Dashboard
                    </button>
                    <button onClick={() => (
                        setTitle('Users Manager')
                        )}>
                        Manager Users
                    </button>
                    <button onClick={() => (
                        setTitle('Posts Manager')
                    )}>Manager Posts</button>
                    <button onClick={() => (
                        setTitle('Feedbacks Manager')
                    )}>Manager Feedbacks</button>
                </div>


            </div>
            <div className="LeftManager">
                <div className="ManagerHeader"> 
                    {title === "Dashboard" && <Dashboard admin={admin} dispatch={dispatch} authData={authData} socket={socket}/>}
                    {title === "Users Manager" && <UserManager admin={admin} dispatch={dispatch} authData={authData} socket={socket}/>}
                    {title === "Posts Manager" && <PostManager admin={admin} dispatch={dispatch} authData={authData} socket={socket}/>}
                    {title === "Feedbacks Manager" && <FeedbackManager admin={admin} dispatch={dispatch} authData={authData} socket={socket}/>}
                </div>
            </div>
        </div>
            
    </div>
  )
}

export default Manager