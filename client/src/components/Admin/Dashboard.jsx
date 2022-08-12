import React from 'react'
import './Admin.css'
import Chart from './ChartRealtime'
import User from '../../images/user.png'
import Post from '../../images/post.png'

const Dashboard = ({admin, dispatch, authData, socket}) => {
  
  return (
    <div className='Dashboard'>
        <h3>Dashboard</h3>
        <div className="BodyDashboard">
          <div className='TotalUsers'>
            <div><img src={User} alt="" /></div>
            <h3>{`Total Users: ${admin.users.length}`}</h3>
          </div>
          <div className='TotalPosts'> 
            <div><img src={Post} alt="" /></div>
            <h3>{`Total Posts: ${admin.posts.length}`}</h3>
          </div>
        </div>
        <div className="ChartRealtime">
          <Chart admin={admin} dispatch={dispatch} authData={authData}/>
        </div>
    </div>
  )
}

export default Dashboard