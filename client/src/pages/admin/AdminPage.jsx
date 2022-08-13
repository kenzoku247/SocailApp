import React, { useEffect,  } from 'react'
import LoginAdmin from '../../components/Admin/LoginAdmin'
import './AdminPage.css'
import { useDispatch, useSelector } from 'react-redux'
import Manager from '../../components/Admin/Manager'
import { refreshAdminToken } from '../../redux/actions/adminAction'

const AdminPage = () => {
  const dispatch = useDispatch()
  const {authData} = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(refreshAdminToken({authData}))
  },[dispatch,authData])

  const { admin } = useSelector(state => state)

  return (
      !admin.token ?  <LoginAdmin/> : <Manager/>
  )
}

export default AdminPage