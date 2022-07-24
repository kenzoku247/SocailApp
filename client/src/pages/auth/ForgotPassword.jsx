import React, {useState} from 'react'
import Logo from '../../images/logo.png'
import { useDispatch, useSelector } from 'react-redux'
import { forgot } from '../../redux/actions/authAction'
import Back from '../../images/arrowBack.png'
import './Auth.css'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
  const { alert } = useSelector(state => state)
  const initialState = {
      email: ''
  }
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [data, setData] = useState(initialState)
  const { email } = data

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value})
  }

  const resetForm = () => {
    setData(initialState);
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(forgot(data))
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
          <h3>Forgot password</h3>
          <label htmlFor="email">Enter your email address</label>
          <input type="text" 
            placeholder='email@address.com' 
            className='InfoInput'
            name='email'
            onChange={handleChange}
            value={email}
          />
          <div className='checkValid'>
            <small className= "text-danger">
                {alert.email ? alert.email : ''}
            </small> 
          </div>
          <div className="ForGot_Footer">
            <img src={Back} alt="Go Back" onClick={() => {navigate('/');resetForm()}}/>
            <button 
              className="button VerifyButton"  
              type='submit'
            >
              Verify your email
            </button>
          </div>
          </form>    
        </div>
    </div>
  )
}

export default ForgotPassword