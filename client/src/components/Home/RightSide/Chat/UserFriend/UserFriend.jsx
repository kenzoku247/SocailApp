
import { Link } from 'react-router-dom';

import './UserFriend.css'

const Users = ({user}) => {

  return (
    <div className="UserFriend">
        <Link to={'/'} className='UserFriend_Link'>
            <img src={
                user.avatar
            } alt="" className='UserFriend_Image'/>
            <div className=''></div>
            <span>
                {user.fullName}
            </span>
            <span>
                Last Message...
            </span>
        </Link>


    </div>
  )
}

export default Users