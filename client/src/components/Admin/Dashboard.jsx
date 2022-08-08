import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ADMIN_TYPES, deleteUser, getAllUsers, logout, setRole } from '../../redux/actions/adminAction'

const Dashboard = () => {

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

    const handleSetRole = async (id) => {
        const oldRole = admin.users.find(user => user._id === id).role
        let newRole = {role: oldRole === "User" ? "Admin" : "User"}
        dispatch(setRole({id,newRole,admin,authData,socket}))
    }

    const handleDeleteUser = (id) => {
        if(window.confirm('Do you want to delete this user?')){
            dispatch(deleteUser({id,admin,authData}))
        }
    }
    
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
                    <div className="UserManager">
                        <h3>{title}</h3>
                        {title === 'Manager Users' &&
                            <div className="UserList">
                                <div className="UserListHeader">
                                    <h5>User list</h5>
                                    <input 
                                        className='' 
                                        type='text' 
                                        placeholder='Search User'
                                        
                                    />
                                </div>
                                <div className="UserListField">
                                    <div className="FieldName">
                                        <h6>No</h6>
                                        <h6>Profile</h6>
                                        <h6>Email</h6>
                                        <h6>Role</h6>
                                        <h6>Status</h6>
                                    </div>
                                    <div className="InfoUser">
                                        {admin.users.map((user, index) => 
                                            <div key={user._id}>
                                                <h6>{index + 1}</h6>
                                                <h6>{user.fullName}</h6>
                                                <h6>{user.email}</h6>
                                                <div className="RoleUser">
                                                    <h6>{user.role}</h6>
                                                    <button className="btn btn-secondary dropdown-toggle EditUser" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                        Edit
                                                    </button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        <li><button  className="dropdown-item" onClick={() => handleSetRole(user._id)}>{user.role === "Admin" ? "Set as User" : "Set as Admin"}</button></li>
                                                        <li><button  className="dropdown-item">Disable Account</button></li>
                                                    </ul>
                                                    <button className="btn btn-secondary DeleteUser" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                                </div>
                                                <div></div>
                                            </div>
                                        )}
                                        
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
            
    </div>
  )
}

export default Dashboard