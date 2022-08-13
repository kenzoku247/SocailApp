import React, { useState } from 'react'
import { Modal, useMantineTheme } from '@mantine/core';
import './CreateUserModal.css'
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../../redux/actions/adminAction';

const CreateUserModal = ({openCreateUserModal, setOpenCreateUserModal}) => {
    const { authData } = useSelector(state => state.auth)
    const theme = useMantineTheme();
    const dispatch = useDispatch()
    const { alert, admin } = useSelector(state => state)
    const initialState = {
        firstName: "", 
        lastName: "", 
        username: "",
        email: "",
        password: "", 
        confirmPassword: "", 
        gender: "Male"
    }

    const [data, setData] = useState(initialState)
    const { firstName, lastName, username, email, password, confirmPassword } = data

    const [typePass, setTypePass] = useState(false)
    const [typeCfPass, setTypeCfPass] = useState(false)

    const handleChange = (e) => {
        setData({...data, [e.target.name]: e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(createUser({data,admin,authData}))
    }
  return (
    <Modal
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        size='55%'
        opened = {openCreateUserModal}
        onClose = {()=> {
            setOpenCreateUserModal(false);
        }}
        >

        <div className='CreateUserModal'>
            <form action="" className="InfoForm AuthForm" onSubmit={handleSubmit}>
                <h3>Create New User</h3>

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
                   
                <div className='InfoLine'>
                    <input type="text" 
                    placeholder='Username' 
                    className='InfoInput'
                    name='username'
                    onChange={handleChange}
                    value={username}
                    />
                </div>
                <div className='checkValid'>
                    <small className=" text-danger">
                            {alert.username ? alert.username : ''}
                    </small> 
                </div>
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
                    
                </div>
                
                <div className='checkValid'>
                    <small className=" text-danger">
                            {alert.password ? alert.password : ''}
                    </small> 

                    <small className=" text-danger">
                            {alert.confirmPassword ? alert.confirmPassword : ''}
                    </small> 

                </div>
                
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

            
                <button 
                    className="button InfoButton" 
                    type='submit' 
                >
                    Create
                </button>
                
            </form>
        </div>
        </Modal>
  )
}

export default CreateUserModal