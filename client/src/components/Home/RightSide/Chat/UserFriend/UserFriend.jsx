
import { Link } from 'react-router-dom';

import './UserFriend.css'

const Users = ({user}) => {

  return (
    <div className="UserFriend">
        <Link to={'/'} className='UserFriend_Link'>
            <img src={
                user.avatar
            } alt="" className='UserFriend_Image'/>
            <div className='UserFriend_Center'>
                <h6 style={{marginBottom:'0px'}}>
                    {user.fullName}
                </h6>
                <span>
                    Last Message...
                </span>
            </div>
        </Link>


    </div>
  )
}

export default Users