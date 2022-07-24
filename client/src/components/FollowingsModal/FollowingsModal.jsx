import React from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import { useSelector } from "react-redux";
import Users from "../Users/Users";

const FollowersModal = ({ users, showFollowings, setShowFollowings }) => {
  const { authData } = useSelector(state => state.auth)
  
  const theme = useMantineTheme();
  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={showFollowings}
      onClose={() => setShowFollowings(false)}
    >

    <div className='FollowersCard'>
        <div className="FollowersCard__Header">
            <h3>Followings</h3>     
        </div>
        <div className="suggestions">
        {
            users.map(user => (
                <Users key={user._id} user={user} setShowFollowings={setShowFollowings} >
                    {
                        authData.user._id !== user._id
                    }
                </Users>
            ))
        }
        </div>

    </div>
    
    </Modal>
  );
};

export default FollowersModal;
