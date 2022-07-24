import React from 'react'
import Logo from '../../../../images/logo.png'
import {UilSearch} from '@iconscout/react-unicons' 
import './LogoSearch.css'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import SearchModal from '../../../SearchModal/SearchModal'
import { useSelector } from 'react-redux'

const LogoSearch = () => {
  const { authData } = useSelector(state => state.auth)
  const [onSearch, setOnSearch] = useState(false)

  return (
    <div className='LogoSearch Header'>
        <Link to="/">
          <img src={Logo} alt="" />
        </Link>
        <div className="Search">
          <button onClick={() => setOnSearch(true)}>
            #Explore
          </button>
            <div className="s-icon">
                <UilSearch onClick={() => setOnSearch(true)}/>
            </div>
        </div>
        <SearchModal onSearch={onSearch} setOnSearch={setOnSearch} authData={authData}/>
    </div>
  )
}

export default LogoSearch