import React from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import Users from "../Users/Users";

const FollowersModal = ({ users, showFollowers, setShowFollowers }) => {
  const theme = useMantineTheme();
  // console.log(users);
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
      opened={showFollowers}
      onClose={() => setShowFollowers(false)}
    >
    <div className='FollowersCard'>
      <div className="FollowersCard__Header">
          <h3>Followers</h3>     
      </div>
      <div className="suggestions"></div>
        {
          users.map(user => (
            <Users key={user._id} user={user} setShowFollowers={setShowFollowers} />
          ))
        }
    </div>
    </Modal>
  );
};

export default FollowersModal;
