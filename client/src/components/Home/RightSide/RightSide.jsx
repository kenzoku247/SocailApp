import React, { useEffect, useState } from "react";
import "./RightSide.css";
import Home from "../../../images/home.png";
import DiscoverIcon from '../../../images/discover.png'
import noNotify from "../../../images/bell.png"
import ChatIcon from "../../../images/chat.png"
import Setting from "../../../images/settings.png"
import NotifyModal from "../../NotifyModal/NotifyModal";
import haveNotify from '../../../images/notification.png'
import Friend1 from '../../../images/friends1.png'
import Friend2 from '../../../images/friends2.png'
import SavedPost from '../../../images/saved.png'
import { useDispatch, useSelector } from "react-redux";
import SettingModal from "../../SettingModal/SetttingModal";
import { logout } from "../../../redux/actions/authAction";
import Friends from "./Friends/Friends";
import Chat from './Chat/Chat'
import Discover from "./Discover/Discover";
import { Link } from "react-router-dom";

const RightSide = () => {
  const dispatch = useDispatch()
  const { notify } = useSelector(state => state)
  const { authData } = useSelector(state => state.auth)
  const [openDiscover, setOpenDiscover] = useState(true)
  const [openFriends, setOpenFriends] = useState(false)
  const [openChat, setOpenChat] = useState(false)

  // console.log(notify.data);
  const readAll = notify.data.every(noti => (noti.isRead === true))

  const handleLogout =() => {
    dispatch(logout())
  }
  return (
    <div className="RightSide">
      <div className="navIcons">
        {/* <img src={Home} alt="" /> */}
        <img src={DiscoverIcon} alt="" style={{cursor:'pointer'}} onClick={() => {setOpenFriends(false);setOpenDiscover(true)}}/>
        <img src={authData.user.friendsWaitToAccept.length > 0 ? Friend2 : Friend1} alt="" style={{cursor:'pointer'}} onClick={() => {setOpenDiscover(false);setOpenFriends(true)}}/>
        <img src={ChatIcon} alt="" style={{cursor:'pointer'}} onClick={() => setOpenChat(prev => !prev)}/>
        <Link  to={`/saved/${authData.user._id}`}>
          <img src={SavedPost} alt="" />
        </Link>
        <div className="dropdown">
          <button  type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={ readAll ? noNotify : haveNotify} alt="Notification" style={{cursor:'pointer'}}/>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
            <NotifyModal/>
          </ul>
        </div>
        
        <div className="dropdown">
        <button  type="button" id="dropdownMenu3" data-bs-toggle="dropdown" aria-expanded="false">
            <img src={Setting} alt="Setting" style={{cursor:'pointer'}}/>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenu3">
            <h3 style={{padding:'0 8px',fontWeight:'bold'}}>Setting</h3>
            <hr className="mt-0" />
            {authData.user.role === "Admin" && <li><Link to={`/admin/${authData.user._id}`}><button className="dropdown-item" type="button">Administrator</button></Link></li>}
            <li><button className="dropdown-item" type="button"  onClick={handleLogout}>Log Out</button></li>

          </ul>
        </div>
      </div>

      { openDiscover && <Discover/>}
      { openFriends && <Friends /> }
      { openChat && <Chat openChat={openChat} setOpenChat={setOpenChat}/>}
    </div>
  );
};

export default RightSide;