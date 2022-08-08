import React, { useState } from 'react'
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RedirectImg from '../../images/redirect.jpg'
import SpaceShip from '../../images/spaceship.gif'
import './Redirect.css'

const Redirect = () => {
  const initialSeconds = 10
  const [seconds, setSeconds ] =  useState(initialSeconds);
  const [leave, setLeave] = useState(false)
  const navigate = useNavigate()
  useEffect(()=>{
  let myInterval = setInterval(() => {
          if (seconds > 0) {
              setSeconds(seconds - 1);
          }
          if (seconds === 0) {
            clearInterval(myInterval)
            navigate('/')
          } 
      }, 1000)
      return ()=> {
          clearInterval(myInterval);
        };
  });

  const handleLeave = () => {
    setLeave(true)
    setTimeout(() => {
      navigate('/')
    },5000
    )
  }
  return (
    <div className='RedirectPage'>
        { !leave && 
          <>
            <div className='Text'>
              <h2>{`Oops. You need to Login to access this link. Redirect in ${seconds}s.`}</h2>
              <h3>Or press the button below to Login.</h3>
            </div>
            <button onClick={handleLeave}>GO NOW</button>
          </>
        }
        <img src={RedirectImg} alt="" />
        { leave && 
          <div className="NavigateGif">
            <img src={SpaceShip} alt="" />
          </div>
        }

    </div>
  )
}

export default Redirect