import React, { useEffect } from 'react'
import './Auth.css'
import Logo from '../../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, loginWithGoogle, register } from '../../redux/actions/authAction'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'
import jwt_decode from "jwt-decode";

const Auth = () => {
    const dispatch = useDispatch()
    const {authData} = useSelector(state=>state.auth)
    const { alert } = useSelector(state => state)
    
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false)

    const initialState = {
        firstName: "", 
        lastName: "", 
        username: "",
        email: "",
        password: "", 
        confirmPassword: "", 
        gender: "male"
    }

    // const googleInit = {
    //     username: '',
    //     email: '', 
    //     email_verified: false,
    //     firstName: '', 
    //     lastName: '', 
    //     avatar: ''
    // }

    // const [googleData, setGoogleData] = useState(googleInit)

    const [data, setData] = useState(initialState)
    const { firstName, lastName, username, email, password, confirmPassword } = data

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    const clientId = "1011621285553-gsh386hr98fmiqlqq4dh90ie44eiu5sn.apps.googleusercontent.com"

    useEffect(() => {
        if(authData.token) 
        navigate('/')
    }, [authData.token, navigate])

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if(isSignUp) {
            dispatch(register(data))
        } else {
            dispatch(login(data))
        }
    }

    const resetForm = () => {
        setData(initialState);
    }

    const handleCallbackResponse = (response) => {
        var userObject = jwt_decode(response.credential)
        const { email, email_verified, family_name, given_name, picture, sub} = userObject
        dispatch(loginWithGoogle({email,email_verified,firstName: family_name,lastName: given_name,avatar: picture, username: sub}))
    } 

    useEffect(() => {
        window.google.accounts.id.initialize({
            client_id : clientId,
            callback: handleCallbackResponse
        });

        window.google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            { theme : "outline", size: "large"}
        )
    })

  return (
    <div className='Auth'>
        {/* Left Side */}
        <div className="Auth-left">
            <img src={Logo} alt="" />
            <div className="WebName">
                <h1 className='Title-Web'>Together</h1>
                <h6>Explore the ideas throughout the world</h6>

            </div>
        </div>

        {/* Right Side */}
        <div className="Auth-right">
            
            <form action="" className="InfoForm AuthForm" onSubmit={handleSubmit}>
                <h3>{isSignUp ? "Sign Up" : "Log In"}</h3>
                {isSignUp && 
                    <>
                    <div className='InfoLine'>
                        <div>
                            <input type="text" 
                            placeholder='First Name' 
                            className='InfoInput'
                            name='firstName'
                            onChange={handleChange}
                            value={firstName}
                            />
                            <input type="text" 
                            placeholder='Last Name' 
                            className='InfoInput'
                            name='lastName'
                            onChange={handleChange}
                            value={lastName}
                            />
                            
                        </div>
                        <div>
                        <input type="text" 
                            placeholder='Email' 
                            className='InfoInput'
                            name='email'
                            onChange={handleChange}
                            value={email}
                            />
                        </div>
                        
                    </div>
                    
                
                    <div className='checkValid'>
                        <small className=" text-danger">
                                {alert.firstName ? alert.firstName : ''}
                        </small> 

                        <small className=" text-danger">
                                {alert.lastName ? alert.lastName : ''}
                        </small> 

                        <small className=" text-danger">
                                {alert.email ? alert.email : ''}
                        </small> 
                    </div>
                    </>
                }
                   
                <div className='InfoLine'>
                    <input type="text" 
                    placeholder='Username' 
                    className='InfoInput'
                    name='username'
                    onChange={handleChange}
                    value={username}
                    />
                </div>
                { isSignUp && 
                    <div className='checkValid'>
                        <small className=" text-danger">
                                {alert.username ? alert.username : ''}
                        </small> 
                    </div>
                }
                <div className='InfoLine'>
                    <div className='Password'>
                        <input type={ typePass ? "text" : "password" }
                        placeholder='Password' 
                        className='InfoInput'
                        name='password'
                        onChange={handleChange}
                        value={password}
                        />
                        <small onClick={() => setTypePass(!typePass)}>
                                {typePass ? 'Hide' : 'Show'}
                        </small>
                    </div>
                    
                    {isSignUp &&
                        <div className="ConfirmPassword">
                            <input type={ typeCfPass ? "text" : "password" } 
                            placeholder='Confirm Password' 
                            className='InfoInput'
                            name='confirmPassword'
                            onChange={handleChange}
                            value={confirmPassword}
                            />
                            <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            {typeCfPass ? 'Hide' : 'Show'}
                        </small>
                        </div>
                    }
                    
                </div>
                
                { isSignUp && 
                    <div className='checkValid'>
                        <small className=" text-danger">
                                {alert.password ? alert.password : ''}
                        </small> 

                        <small className=" text-danger">
                                {alert.confirmPassword ? alert.confirmPassword : ''}
                        </small> 

                    </div>
                }
                
                {isSignUp &&
                    <div className='Gender'>
                        <label htmlFor ='male'>
                            Male: 
                            <input type="radio" 
                            id='male' 
                            className = "radioInput"
                            name='gender' 
                            value ="Male"
                            defaultChecked
                            onChange={handleChange}
                            />
                        </label>
                            
                        <label htmlFor ='female'>
                            Female: 
                            <input type="radio" 
                            id='female' 
                            className = "radioInput"
                            name='gender' 
                            value ="Female"
                            onChange={handleChange}
                            />
                        </label>

                        <label htmlFor ='other'>
                            Other: 
                            <input type="radio" 
                            id='other' 
                            className = "radioInput"
                            name='gender' 
                            value ="Other"
                            onChange={handleChange}
                            />
                        </label>
                    </div>
                }

                

                <div className='Redirect'>
                    <span style={{fontSize: '12px', cursor: 'pointer'}} 
                        onClick = { () => {
                            resetForm();
                            dispatch({type: GLOBAL_TYPES.ALERT, payload: {}});
                            setIsSignUp((prev) => !prev); 
                        }}
                    >
                        {isSignUp ? "Already have an account. Login now!" : "Don't have an account. Sign up now!"}
                    </span>
                    {!isSignUp 
                    ? (<span style={{fontSize: '12px' }} 
                            onClick = { () => {
                                resetForm();
                                dispatch({type: GLOBAL_TYPES.ALERT, payload: {}}) 
                            }} 
                        >
                        <Link to="/forgot" 
                            style={{textDecoration: 'none', color: 'red', fontWeight: '600'}}>Forgot your password?
                        </Link>
                    </span>)
                    : ""
                    }
                </div>
                <button 
                    className="button InfoButton" 
                    type='submit' 
                >
                    {isSignUp ? "Signup" : "Login"}
                </button>
                { !isSignUp && 
                    <div className='LoginWithGoogle'>
                        <div style={{fontSize:'12px'}}>Or Login With</div>
                        <div id="signInDiv" ></div>
                    </div>
                }
                
            </form>
        </div>

    </div>
  )
}



export default Auth