import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'

const NotFound = () => {
  return (  
    <div className='NotFound'>
      <h1 className="text">404 Error Page</h1>
      <p className="zoom-area">Oops! Looks like you got lost</p>
      <section className="error-container">
          <span>4</span>
          <span><span className="screen-reader-text">0</span></span>
          <span>4</span>
      </section>
      <div className="link-container">
          <Link to="/" className="more-link">Go to home page</Link>
      </div>
    </div>
  )
};

export default NotFound;