import React from 'react'
import './Admin.css'
import Chart from './ChartRealtime'
import User from '../../images/user.png'
import Post from '../../images/post.png'
import Feedback from '../../images/feedback.png'

const Dashboard = ({admin, dispatch, authData, socket}) => {
  
  return (
    <div className='Dashboard'>
        <h3>Dashboard</h3>
        <div className="BodyDashboard">
          <div className='TotalUsers'>
            <div><img src={User} alt="" /></div>
            <h5>{`Total Users: ${admin.users.length}`}</h5>
          </div>
          <div className='TotalPosts'> 
            <div><img src={Post} alt="" /></div>
            <h5>{`Total Posts: ${admin.posts.length}`}</h5>
          </div>
          <div className='TotalFeedbacks'> 
            <div><img src={Feedback} alt="" /></div>
            <h5>{`Total Feedbacks: ${admin.feedbacks.length}`}</h5>
          </div>
        </div>
        <div className="ChartRealtime">
          <Chart admin={admin} dispatch={dispatch} authData={authData}/>
        </div>
    </div>
  )
}

export default Dashboard