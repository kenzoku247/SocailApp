import React from 'react'
import './FollowersCard.css'
import { useDispatch, useSelector } from 'react-redux'
import Users from '../../../Users/Users'
import Reload from '../../../../images/reload.png'
import LoadGif from '../../../../images/loading.gif'
import { getSuggestions } from '../../../../redux/actions/suggestionsAction'

const FollowersCard = ({id, authData, profile, location}) => {
  const dispatch = useDispatch()
  const { suggest } = useSelector(state => state)

  return (
    <div className='FollowersCard' >
      <div className="FollowersCard__Header">
        <h5 style={{fontWeight:"bold"}}>People may you know</h5>
        {
          !suggest.loading &&
          <img src= {Reload} alt =""
          onClick={ () => dispatch(getSuggestions(authData.token))}
          />
        }
        
      </div>

      {
        suggest.loading
        ? <img src={LoadGif} alt="loading"/>
        : (location === "profile" 
           ?<div className="suggestions" style={{"height": "380px"}}>
            {
                suggest.users.map(user => (
                    <Users key={user._id} user={user}/>
                ))
            }
          </div>
          : <div className="suggestions"  style={{"height": "190px"}}>
            {
                suggest.users.map(user => (
                    <Users key={user._id} user={user}/>
                ))
            }
          </div>
          )
          
      }
      </div>
  )
}

export default FollowersCard