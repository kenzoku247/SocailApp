import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import Logo from '../../images/logo.png'
import { reset } from '../../redux/actions/authAction'
import './Auth.css'

const ResetPassword = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { alert } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    const {token} = useParams()

    const initialState = {
        password: "", 
        confirmPassword: ""
    }

    const [data, setData] = useState(initialState)
    const { password, confirmPassword } = data
    
    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    useEffect(() => {
        if(authData.token) 
        navigate('/')
    }, [authData.token, navigate])

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(reset({data,token}))
    }
  return (
    <div className='Auth'>
    <div className="Auth-left">
      <img src={Logo} alt="" />
      <div className="WebName">
          <h1 className='Title-Web'>Together</h1>
          <h6>Explore the ideas throughout the world</h6>

      </div>
    </div> 
    <div className="Auth-right ">
        <form action="" className="ResetForm AuthForm" onSubmit={handleSubmit}>
            <h3>Reset Your Password</h3>
            <div className='Password'>
                <label htmlFor="password">Password</label>
                <input 
                    type={ typePass ? "text" : "password" } 
                    placeholder='Password' 
                    className='InfoInput' 
                    name="password" 
                    onChange={handleChange}
                    value={password}
                />
                <small onClick={() => setTypePass(!typePass)} className='Small_Reset'>
                    {typePass ? 'Hide' : 'Show'}
                </small>
            </div>
            <div className='checkValid'>
                <small className=" text-danger">
                        {alert.password ? alert.password : ''}
                </small> 
            </div>
            <div className="ConfirmPassword">
                <label htmlFor="cf_password">Confirm Password</label>
                <input 
                    type={ typeCfPass ? "text" : "password" }  
                    className='InfoInput' 
                    placeholder='Confirm Password'
                    name="confirmPassword"
                    onChange={handleChange} 
                    value={confirmPassword}
                />   
                <small onClick={() => setTypeCfPass(!typeCfPass)} className='Small_Reset'>
                    {typeCfPass ? 'Hide' : 'Show'}
                </small>  
            </div>
            <div className='checkValid'>
                <small className=" text-danger">
                    {alert.confirmPassword ? alert.confirmPassword : ''}
                </small> 
            </div>    
            <button className='button VerifyButton' type='submit'>
                Reset Password
            </button>
        </form>
    </div>
        
  </div>
  )
}

export default ResetPassword