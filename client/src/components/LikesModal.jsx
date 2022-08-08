import React from 'react';
import { Modal, useMantineTheme } from '@mantine/core';

const LikesModal = ({setOnLikes, onLikes, data}) => {
    const theme = useMantineTheme();
    console.log(data);
    const usersLiked = data.map((user) => (user.fullName))
    const avatar = data.map((user) => (user.avatar))

  return (
    <Modal
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        size='30%'
        opened = {onLikes}
        onClose = {()=> {
            setOnLikes(false);
        }}
    >
        <h3 style={{"marginBottom":"2rem"}}>People who liked this post</h3>
        <ul style={{"overflowY":"auto"}}>
            {data.map(user => (
                <div style={{"display":"flex","alignItems":"center","gap":"0.5rem","marginBottom":"1rem"}}>
                    <img src={user.avatar} alt="" style={{width: '30px',"border":"1px solid black","borderRadius":"50%"}}/>
                    <h5 style={{"fontWeight":"normal","fontSize":"16px"}}>{user.fullName}</h5>
                </div>
            ))}
        </ul>
    </Modal>
  )
}

export default LikesModal