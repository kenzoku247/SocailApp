import React, { useEffect, useState } from "react";
import "./InfoCard.css";
import { UilPen } from "@iconscout/react-unicons";
import ProfileModal from '../../ProfileModal/ProfileModal';
// import { GLOBAL_TYPES } from "../../../redux/actions/globalTypes";
// import { logout } from '../../../redux/actions/authAction'

const InfoCard = ({id, authData, profile, dispatch}) => {
  const [onEdit, setOnEdit] = useState(false);
  const [userData, setUserData] = useState([])

  // const handleLogout =() => {
  //   dispatch(logout())
  // }
  useEffect(() => {
    if(id === authData.user._id){
        setUserData([authData.user])
    }else{
        const newData = profile.users.filter(user => user._id === id)
        if (newData.length === 2) {
          if (JSON.stringify(newData[0]) === JSON.stringify(newData[1])) {
            newData.pop()
          }
        }
        setUserData(newData)
    }
  }, [id, authData, dispatch, profile.users])
  return (
    userData.map(user => (
    <div key={user._id} className="InfoCard">
      <div className="InfoHead">
        <h5 style={{fontWeight:"bold"}}>{id === authData.user._id ? "Your Info" : "Info"}</h5>
        {id === authData.user._id 
        ? <div>
            <UilPen
              width="2rem"
              height="1.2rem"
              onClick={() => setOnEdit(true)}
            />
            <ProfileModal
              onEdit = {onEdit}
              setOnEdit = {setOnEdit}
              authData = {authData}
            />
          </div>
        : ""
      }
        
      </div>

      <div className="Info">
        <span>
          <b>Story: </b>
        </span>
        <span>{user.story}</span>
      </div>

      <div className="Info">
        <span>
          <b>Address: </b>
        </span>
        <span>{user.address}</span>
      </div>

      <div className="Info">
        <span>
          <b>Mobile: </b>
        </span>
        <span>{user.mobile}</span>
      </div>

      <div className="Info">
        <span>
          <b>Website: </b>
        </span>
        <span>{user.website}</span>
      </div>

      <div className="Info">
        <span>
          <b>Gender: </b>
        </span>
        <span>{user.gender}</span>
      </div>

      {/* {id === authData.user._id 
        ? <button className="button logout-button" onClick={handleLogout}>Logout</button>
        : ""
      } */}
      
    </div>
    ))
  );
};

export default InfoCard;