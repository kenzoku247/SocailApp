import React, { useEffect, useState } from 'react'
import { deleteUser, searchUser, setDisable, setRole } from '../../redux/actions/adminAction'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'
import { getAdminDataAPI, getDataAPI } from '../../utils/fetchData'
import './Admin.css'

const UserManager = ({admin, dispatch, authData, socket}) => {

    
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const handleSetRole = async (user) => {
        if(window.confirm(`Do you want to set this user as ${user.role  === "User" ? "Admin" : "User"}?`)){
            const newRole = {role: user.role === "User" ? "Admin" : "User"}
            dispatch(setRole({id:user._id,newRole,admin,authData,socket}))
        }
    }

    const handleSetDisable = async (user) => {
        if(window.confirm(`Do you want to ${user.isDisabled ? "enable" : "disable"} this user?`)){
            const isDisabled = {isDisabled: user.isDisabled}
            dispatch(setDisable({id: user._id,isDisabled,admin,authData,socket}))
        }
    }

    const handleDeleteUser = (id) => {
        if(window.confirm('Do you want to delete this user?')){
            dispatch(deleteUser({id,admin,authData}))
        }
    }

    useEffect(() => {
        if (search.length === 0) {
            setUsers([])
        }
    }, [search.length])

    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const res = await getAdminDataAPI(`search?fullName=${search}` , authData.token)
            setUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

  return (
    <div className="UserManager">
        <h3>User Manager</h3>
        <div className="UserList">
            <div className="UserListHeader">
                <h5>User list</h5>
                <form action="" onSubmit={handleSearch}>
                    <input 
                        className='input-search' 
                        type='text' 
                        placeholder='Search User'
                        onChange={e => setSearch(e.target.value)}
                        value={search}
                    />
                </form>
            </div>
            <div className="UserListField">
                <div className="FieldUserName">
                    <h6>No</h6>
                    <h6>Profile</h6>
                    <h6>Email</h6>
                    <h6>Role</h6>
                    <h6>Status</h6>
                </div>
                <div className="InfoUser">
                    { (search.length > 0 && users.length > 0) 
                        ? users.map((user, index) => 
                            <div key={user._id}>
                                <h6>{index + 1}</h6>
                                <h6>{user.fullName}</h6>
                                <h6>{user.email}</h6>
                                <div className="RoleUser">
                                    <h6 className={`${user.role}`}>{user.role}</h6>
                                    {user._id !== authData.user._id &&
                                        <>
                                            <button className="btn btn-secondary dropdown-toggle EditUser" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                Edit
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li><button  className="dropdown-item" onClick={() => handleSetRole(user)}>{user.role === "Admin" ? "Set as User" : "Set as Admin"}</button></li>
                                                <li><button  className="dropdown-item" onClick={() => handleSetDisable(user)}>{user.isDisabled ? "Enable" : "Disable"} Account</button></li>
                                            </ul>
                                            <button className="btn btn-secondary DeleteUser" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </>
                                    }
                                </div>
                                <h6 className={user.isDisabled ? "Disable" : "Enable"}>{user.isDisabled ? "Disable" : "Enable"}</h6>
                            </div>
                        )
                        : admin.users.map((user, index) => 
                            <div key={user._id}>
                                <h6>{index + 1}</h6>
                                <h6>{user.fullName}</h6>
                                <h6>{user.email}</h6>
                                <div className="RoleUser">
                                    <h6 className={`${user.role}`}>{user.role}</h6>
                                    {user._id !== authData.user._id &&
                                        <>
                                            <button className="button dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                Edit
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                <li><button  className="dropdown-item" onClick={() => handleSetRole(user)}>{user.role === "Admin" ? "Set as User" : "Set as Admin"}</button></li>
                                                <li><button  className="dropdown-item" onClick={() => handleSetDisable(user)}>{user.isDisabled ? "Enable" : "Disable"} Account</button></li>
                                            </ul>
                                            <button className="button" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                                        </>
                                    }
                                </div>
                                <h6 className={user.isDisabled ? "Disable" : "Enable"}>{user.isDisabled ? "Disable" : "Enable"}</h6>
                            </div>
                        )
                    }

                    
                    
                </div>
            </div>
        </div>
    </div>
  )
}

export default UserManager