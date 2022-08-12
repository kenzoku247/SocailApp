import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { ADMIN_TYPES, getPassword, login } from '../../redux/actions/adminAction'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'

import './Admin.css'

const LoginAdmin = () => {

    const { authData } = useSelector(state => state.auth)
    const { alert } = useSelector(state => state)

    const init = {
        username: "",
        password: ""
    }

    const { id } = useParams()
    const [data, setData] = useState(init)
    const { username, password } = data

    const dispatch = useDispatch()
    
    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})


    }



    const handleGetPassword = async () => {
        console.log(username);
        try {
           dispatch(getPassword({id, data, authData}))
        } catch (error) {
            console.log(error.response);
        }   

    }
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            dispatch(login({data, authData}))
        } catch (error) {
            console.log(error.response.data.msg);
        }
    }
  return (
    <div className='LoginAdmin'>
        <form className='Form_LoginAdmin' onSubmit={handleLogin}>
            <div className="UserAdmin">
                <label className="form-label" for="form2Example1">Username</label>
                <input 
                    type="text" 
                    id="form2Example1" 
                    className="" 
                    name="username"
                    value={username}
                    onChange={handleChange}
                />
            </div>

            <div className="PasswordAdmin">
                <label className="form-label" for="form2Example2">Password</label>
                <input 
                    type="password" 
                    id="form2Example2" 
                    className=""
                    name="password"
                    value={password}
                    onChange={handleChange}
                />
            </div>
                <small className=" text-danger">
                    {alert.password ? alert.password : ''}
                </small>  
            
            <div className="Button_LoginAdmin">
                <button type="button" className="" onClick={handleGetPassword}>Get Password</button>
                <button type="submit" className="">Sign in</button>
            </div>


        </form>
    </div>
  )
}

export default LoginAdmin