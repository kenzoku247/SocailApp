import { Modal, useMantineTheme } from '@mantine/core';
import { useState, useEffect } from 'react';
import { useDispatch} from 'react-redux';
import { checkImage } from '../../utils/imageUpload'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser } from '../../redux/actions/profileAction'
import './ProfileModal.css'

function ProfileModal({onEdit, setOnEdit, authData}) {
    const theme = useMantineTheme();
    const initState = {
        firstName: '',lastName: '', mobile: '', address: '', website: '', story: '', gender: ''
    }
    const [userData, setUserData] = useState(initState)
    const { firstName, lastName, mobile, address, website, story, gender } = userData

    const [avatar, setAvatar] = useState('')
    const [backgroundCover, setBackgroundCover] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        setUserData(authData.user)
    }, [authData.user])

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    const changeAvatar = (e) => {
        const avatar = e.target.files[0]
        const err = checkImage(avatar)
        if(err) return dispatch({
            type: GLOBAL_TYPES.ALERT, payload: {error: err}
        })

        setAvatar(avatar)
    }

    const changeBackgroundCover = (e) => {
        const backgroundCover = e.target.files[0]
        // console.log(file);
        const err = checkImage(backgroundCover)
        if(err) return dispatch({
            type: GLOBAL_TYPES.ALERT, payload: {error: err}
        })

        setBackgroundCover(backgroundCover)
        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateProfileUser({userData, avatar, backgroundCover, authData}))
        setOnEdit(false)
    }
    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            size='55%'
            opened = {onEdit}
            onClose = {()=> setOnEdit(false)}
        >
        <form className="ModalForm" onSubmit={handleSubmit}>
            <h3>Your Info</h3>
            <div className='NameModal'>
                <label>
                    First Name 
                    <input 
                        type="text" 
                        className="ModalInput "
                        name="firstName" 
                        placeholder='First Name' 
                        onChange={handleChange}
                        value = {firstName}
                    />
                    <small className="LengthFirstName" style={firstName.length > 10 ? {color:"red"}: {color:"black"}}>
                            {firstName.length}/10
                    </small>
                    
                </label>
                <label>
                    Last Name
                    <input 
                    type="text" 
                    className="ModalInput"
                    name="lastName" 
                    placeholder='Last Name' 
                    onChange={handleChange}
                    value = {lastName}
                    />
                    <small className="LengthLastName" style={lastName.length > 10 ? {color:"red"}: {color:"black"}}>
                            {lastName.length}/10
                    </small>
                </label>
                
            </div>
            <label>
                Story:
                <textarea 
                    name="story" 
                    cols="30" 
                    rows="4" 
                    className="ModalInput" 
                    placeholder='Story' 
                    onChange={handleChange}
                    value = {story}>
                </textarea>
                <small className="LengthStory" style={story.length > 200 ? {color:"red"}: {color:"black"}}>
                        {story.length}/200
                </small>
            </label>
            <div className='Address-MobileModal'>
                <label>
                    Address:
                    <input 
                    type="text" 
                    className="ModalInput"
                    name="address" 
                    placeholder='Address'
                    onChange={handleChange} 
                    value = {address}
                    />
                </label> 
                
                <label>
                    Mobile:
                    <input 
                    type="text" 
                    className="ModalInput"
                    placeholder='Mobile' 
                    name = 'mobile'
                    onChange={handleChange}
                    value = {mobile}
                    />
                </label>
            </div>

            <div className="Website-Gender">
                <label>
                    Website:
                    <input 
                    type="text" 
                    className="ModalInput"
                    placeholder='Website' 
                    name = 'website'
                    onChange={handleChange}
                    value = {website}
                    />
                </label>
                <label htmlFor="GenderModal">
                    Gender:
                    <select name='gender' id= 'gender' className='ModalInput' value={gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </label>
            </div>    
            

            <div className="ImageModal">
                <label htmlFor="Profile Image">
                    Profile Image
                    <input 
                        type="file"
                        name="avatar" 
                        onChange={changeAvatar}
                    />
                </label>

                <label htmlFor="Cover Image">
                    Cover Image
                    <input 
                        type="file"
                        name="backgroundCover" 
                        onChange={changeBackgroundCover}
                    />
                </label>
                
                
                
            </div>

            <button className="button InfoButton" type='submit'>
                Update
            </button>
        </form>
        </Modal>
    );
}

export default ProfileModal