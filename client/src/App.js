import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './pages/auth/Auth';
import Home from './pages/home/Home';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NotFound from './components/NotFound/NotFound';
import { refreshToken } from './redux/actions/authAction';
import Alert from './components/Alert/Alert'
import { getSuggestions } from './redux/actions/suggestionsAction';
import PageRender from './components/CustomRouter/PageRender';
import { getPosts } from './redux/actions/postAction';
import { getNotifies } from './redux/actions/notifyAction';
import PostModal from './components/PostModal/PostModal';
// import { io } from "socket.io-client";
import { GLOBAL_TYPES } from './redux/actions/globalTypes';
import socketClient from 'socket.io-client';
import ActivationEmail from './pages/auth/ActivationEmail';
import SocketClient from './SocketClient';

function App() {
  const {authData} = useSelector((state)=>state.auth)
  const { status } = useSelector(state => state)
  
  const dispatch = useDispatch()
  const firstLogin = localStorage.getItem('firstLogin')


  useEffect(() => {
    dispatch(refreshToken())

    // const socket = io()
    const socket = socketClient("http://localhost:5000",{
      transports: ["websocket"]
    });
    dispatch({type: GLOBAL_TYPES.SOCKET, payload: socket})
    // return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(authData.token) {
      dispatch(getPosts(authData.token))
      dispatch(getSuggestions(authData.token))
      dispatch(getNotifies(authData.token))
    }
  }, [dispatch, authData.token])

  useEffect(() => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {}
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {}
      });
    }
  },[])

  return (

    <div className="App">
      <div className="blur" style={{top: '-18%',right: '0'}}></div>
      <div className="blur" style={{top: '36%',left: '-8rem'}}></div>
      <Alert />
      {status && <PostModal />}
      {authData.token && <SocketClient />}
      <Routes>
        <Route path="/" exact element={authData.token ? <Home/> : <Auth/>} />
        <Route path="/forgot" element={authData.token  ? <NotFound/> : <ForgotPassword/>} />
        <Route path="/api/reset/:token" exact element={<ResetPassword/>} />
        <Route path="/api/activate/:activation_token" exact element={<ActivationEmail/>}/>

        <Route exact path="/:page" element={firstLogin ? <PageRender/> : <Home/>}/>
        <Route exact path="/:page/:id" element={firstLogin ? <PageRender/> : <Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
