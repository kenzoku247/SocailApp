import React from 'react'
import { Modal, useMantineTheme } from '@mantine/core';
import './FriendsRequestModal.css'
import FriendsRequest from './FriendsRequest/FriendsRequest'
import { useSelector } from 'react-redux';
import FriendsWaitToResponse from './FriendsRequest/FriendsWaitToResponse';

const FriendsRequestModal = ({openFRModal, setOpenFRModal}) => {
    const theme = useMantineTheme();
    const { authData } = useSelector(state => state.auth)

  return (
    <Modal
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        size='55%'
        opened = {openFRModal}
        onClose = {()=> {
            setOpenFRModal(false);

        }}
    >   
        <h3>Friends Request</h3>
        <div className="FriendsRequestModal">
            <div className="WaitToAccept">
                <h6>Waiting For Their Response</h6>
                { authData.user.friendsRequest.map(user => (
                    <FriendsRequest key={user._id ? user._id : user} user={user}/>
                ))}
                
            </div>
            <div className='WaitToAccept'>
                <h6>Waiting For Your Response</h6>
                { authData.user.friendsWaitToAccept.map(user => (
                    <FriendsWaitToResponse key={user._id ? user._id : user} user={user}/>
                ))}
            </div>
        </div>
    </Modal>
  )
}

export default FriendsRequestModal