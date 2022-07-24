import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { activation } from '../../redux/actions/authAction'
import Logo from '../../images/logo.png'
import './Auth.css'

const ActivationEmail = () => {
    const {activation_token} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { authData } = useSelector(state => state.auth)

    useEffect(() => {
        if(activation_token){
            dispatch(activation({activation_token}))
        }
    },[activation_token, dispatch])

    useEffect(() => {
        if(authData.token) 
        navigate('/')
    }, [authData.token, navigate])
  return (
    <div className='Auth'>
        <div className="Auth-left">
            <img src={Logo} alt="Logo" />
            <div className="WebName">
                <h1 className='Title-Web'>Together</h1>
                <h6>Explore the ideas throughout the world</h6>
            </div>
        </div>
    </div>
  )
}

export default ActivationEmail