import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserFriend from './UserFriend/UserFriend'
import Minimize from '../../../../images/minus.png'
import Search from '../../../../images/search.png'
import Back from '../../../../images/arrowBack.png'
import Call from '../../../../images/call.png'
import Video from '../../../../images/video.png'
import Trash from '../../../../images/trash.png'
import Smile from '../../../../images/smiling.png'
import Send from '../../../../images/send.png'
import Photo from '../../../../images/photo.png'
import Delete from '../../../../images/backspace-arrow.png';
import Active from '../../../../images/active.png'
import './Chat.css'
import { useState } from 'react'
import Picker, { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react'
import { getDataAPI } from '../../../../utils/fetchData'
import { GLOBAL_TYPES } from '../../../../redux/actions/globalTypes'
import SearchGif from '../../../../images/search.gif';
import { addMessage, deleteConversation, getConversations, getMessages, loadMoreMessages, MESS_TYPES } from '../../../../redux/actions/messageAction'
import { useEffect } from 'react'
import MsgDisplay from './MsgDisplay/MsgDisplay'
import { imageUpload } from '../../../../utils/imageUpload'
import LoadIcon from '../../../../images/loading.gif'
import { imageShow, videoShow } from '../../../../utils/mediaShow'

const Chat = ({openChat,setOpenChat}) => {
    const { online, message, theme, socket } = useSelector(state => state)
    const {authData} = useSelector(state => state.auth)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const [user, setUser] = useState([])
    const [text, setText] = useState('')
    const [media, setMedia] = useState([])
    const [loadMedia, setLoadMedia] = useState(false)

    const [onSearch, setOnSearch] = useState(false)
    const [idFriend, setIdFriend] = useState('')
    const [showFriendsList, setShowFriendsList] = useState(true)
    const [showChat, setShowChat] = useState(false)

    const [data, setData] = useState([])
    const [result, setResult] = useState(9)
    const pageEnd = useRef()
    const [page, setPage] = useState(0)
    const [isLoadMore, setIsLoadMore] = useState(0)

    const [emojiOpened, setEmojiOpened] = useState(false)
    const [chosenEmoji, setChosenEmoji] = useState(null);
    const [showNotice, setShowNotice] = useState(false)
    const [load, setLoad] = useState(false);
    const [send, setSend] = useState(false)
    const dispatch = useDispatch()

    const refDisplay = useRef()
    const ref = useRef();

    const handleOnSearch = async () => {
        await setOnSearch(prev => !prev);
        !onSearch && ref.current.focus()
    }

    const onEmojiClick = (event, emojiObject) => {
        setChosenEmoji(emojiObject);
        setText(text + emojiObject.emoji)
    }

    useEffect(() => {
        if (search.length === 0) {
            setShowNotice(false)
        }
    }, [search.length])

    // console.log(message);
    useEffect(() => {
        const newData = message.data.find(item => item._id === idFriend)
        if(newData){
            setData(newData.messages)
            setResult(newData.result)
            setPage(newData.page)
        }
    },[message.data, idFriend])

    useEffect(() => {
        if(message.firstLoad) return;
        dispatch(getConversations({authData}))
    },[dispatch, authData, message.firstLoad])
    console.log(message);
    // Load More

    useEffect(() => {
        if (idFriend) {
            const observer = new IntersectionObserver(entries => {
                if(entries[0].isIntersecting){
                    setIsLoadMore(p => p + 1)
                }
            },{
                threshold: 0.1
            })
    
            observer.observe(pageEnd.current)
        }
    }
    ,[idFriend, setIsLoadMore]
    )

    useEffect(() => {
        if (idFriend) {
            if(isLoadMore > 1){
                if(result >= page * 9){
                    dispatch(loadMoreMessages({authData, idFriend, page: page + 1}))
                    setIsLoadMore(1)
                }
            }
        }
        // eslint-disable-next-line
    },[isLoadMore, idFriend])

    // Check User Online - Offline
    useEffect(() => {
        if(message.firstLoad) {
            dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        }
    },[online, message.firstLoad, dispatch])

    useEffect(() => {
        if(idFriend && message.users.length > 0){
            setTimeout(() => {
                refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
            },50)

            const newUser = message.users.find(user => user._id === idFriend)
            if(newUser) setUser(newUser)
        }
    }, [message.users, idFriend])

    useEffect(() => {
        if (authData.user.friends.length > message.users.length)
            handleAddFriend(authData.user.friends)
    })


    const handleSearch = async (e) => {
        e.preventDefault()
        if(!search) return;

        try {
            setLoad(true)
            const res = await getDataAPI(`searchF?fullName=${search}`, authData.token)
            setUsers(res.data.users)
            setShowNotice(true)
            setLoad(false)
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }


    const handleAddFriend = (users) => {
        users.map( user => ((
            dispatch({type: MESS_TYPES.ADD_USER, payload: {...user, text: '', media: []}}),
            dispatch({type: MESS_TYPES.CHECK_ONLINE_OFFLINE, payload: online})
        )))
    }

    const handleDeleteConversation = () => {
        if(window.confirm('Do you want to delete?')){
            dispatch(deleteConversation({authData, idFriend}))
            
        }
    }


    const isOnline = (friend) => {
        if (message.users.length !== 0 && message.users.find(user => user._id === friend._id)) {
            const online = message.users.find(user => user._id === friend._id).online
            if (online) return true
        }
        
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setEmojiOpened(false)
        if(!text.trim() && media.length === 0) return;
        setText('')
        setMedia([])
        setLoadMedia(true)

        let newArr = [];
        if(media.length > 0) newArr = await imageUpload(media)

        const msg = {
            sender: authData.user._id,
            recipient: idFriend,
            text, 
            media: newArr,
            createdAt: new Date().toISOString()
        }
        setLoadMedia(false)
        await dispatch(addMessage({msg, authData, socket}))
        // setSend(true)
        if(refDisplay.current){
            refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
        }
    }

    const handleChangeMedia = (e) => {
        const files = [...e.target.files]
        let err = ""
        let newMedia = []
        files.forEach(file => {
            if(!file) return err = "File does not exist."

            if(file.size > 1024 * 1024 * 5){
                return err = "The image/video largest is 5mb."
            }
            return newMedia.push(file)
        })

        if(err) dispatch({ type: GLOBAL_TYPES.ALERT, payload: {error: err} })
        setMedia([...media, ...newMedia])
    }

    const handleDeleteMedia = (index) => {
        const newArr = [...media]
        newArr.splice(index, 1)
        setMedia(newArr)
    }

    useEffect(() => {
        if (idFriend) {
            const getMessagesData = async () => {
                if(message.data.every(item => item._id !== idFriend)){
                    await dispatch(getMessages({authData, idFriend}))
                    setTimeout(() => {
                        refDisplay.current.scrollIntoView({behavior: 'smooth', block: 'end'})
                    },50)
                }
            }
            getMessagesData()
        }
        
    },[idFriend, dispatch, authData, message.data])

  return (
    <div className='Chat'>
        <div className="Chat_Header">
            <h3 style={{flex:1}}>Chat</h3>   
            { !showChat && onSearch && 
                <form action="" className='SearchForm' onSubmit={handleSearch}>

                    <div className="Search">
                        <input 
                            className='Search_Input' 
                            type='text' 
                            placeholder="Type name of User to find"
                            onChange={e => setSearch(e.target.value)}
                            value={search}
                            required
                            ref={ref}
                            />
                        { search && 
                        <img src={Delete} alt="" onClick={() => {setSearch('');ref.current.focus();}}/>
                        }
                    </div>
                </form>
            }
            { !showChat && <img src={Search} alt="" onClick={() => handleOnSearch()}/>}
            { showChat && <img src={Back} alt="" onClick={() => {setShowChat(false);setShowFriendsList(true)}}/>}
            <img src={Minimize} alt="" onClick={() => setOpenChat(false)}/>
        </div>
        { load && <img className="loading" src={SearchGif} alt="loading" /> }
        {search.length > 0 && (( showNotice && users.length === 0)  && <h6>{`No one has name is ${search}. Try searching with uppercase and lowercase names.`}</h6>)}
        { onSearch && users.length > 0 && 
            users.map(user => (
            <div key={user._id} className="Chat_Friend">
                <div className=""> 
                    <UserFriend
                    user={user}
                    />
                </div>
                <div className="Chat_Open">
                    <button className='button' onClick={() => {
                        setShowFriendsList(false);
                        setIdFriend(user._id);
                        setShowChat(true);setUsers([]);
                        setShowNotice(false)
                        }}>Open Chat
                    </button>
                </div>
            </div>
            ))

        }
        { showFriendsList && !onSearch &&
            <div className="Chat_List">
                {   
                    authData.user.friends.map( friend => 
                        (
                        
                        <div key={friend._id} className='Chat_Friend'>
                            <div className='Friend'>
                                <UserFriend   user={friend}/>
                                { isOnline(friend) &&
                                    <img src={Active} alt="" className='Online_Friend'/>
                                }
                            </div>
                            <div className="Chat_Open">
                                <button className='button' onClick={() => {
                                    setShowFriendsList(false);
                                    setIdFriend(friend._id);
                                    setShowChat(true);
                                    }}
                                >
                                    Open Chat
                                </button>
                            </div>
                        </div>)
                    )
                }
                {/* <button ref={pageEnd} style={{opacity: 1}} >Load More</button> */}
            </div>
        }
        { showChat && message.users.find(user => user._id === idFriend) && 
            <div className="Conversation">
                <div className="Chat_Friend">
                    <h3>{message.users.find(user => user._id === idFriend).fullName}</h3>
                    <div className="Chat_Menu">
                        <img src={Call} alt="Call" />
                        <img src={Video} alt="Video" />
                        <img src={Trash} alt="Trash" onClick={handleDeleteConversation}/>
                    </div>
                </div>
                <div className="Chat_Area" ref={refDisplay}>
                    <button style={{opacity: 0}} ref={pageEnd}>
                        Load more
                    </button>
                    {/* <div className='Blur' style={{right: '10%'}}></div>
                    <div className='Blur' style={{bottom: '40%'}}></div>
                    <div className='Blur' style={{right: '30%',bottom: '15%'}}></div> */}
                    {
                        data.map((msg, index) => (
                            <div key={index}>
                                {
                                    msg.recipient === authData.user._id &&
                                    <div className="Chat_Row Other_Msg">
                                        <MsgDisplay user={user} msg={msg} theme={theme} idFriend={idFriend}/>
                                    </div>
                                }

                                {
                                    msg.recipient !== authData.user._id &&
                                    <div className="Chat_Row You_Msg">
                                        <MsgDisplay user={authData.user} msg={msg} theme={theme} idFriend={idFriend} data={data} reverse='Reverse'/>
                                    </div>
                                }
                            </div>
                        ))
                    }
                    {
                       loadMedia && 
                       <div className="Chat_Row You_Msg">
                           <img src={LoadIcon} alt="loading" style={{width:'70px'}}/>
                       </div>
                   }
                </div>
                <div className="Show_Media" style={{display: media.length > 0 ? 'grid' : 'none'}} >
                {
                    media.map((item, index) => (
                        <div key={index} id="File_Media">
                            {
                                item.type.match(/video/i)
                                ? videoShow(URL.createObjectURL(item), theme)
                                : imageShow(URL.createObjectURL(item), theme)
                            }
                            <span onClick={() => handleDeleteMedia(index)} >&times;</span>
                        </div>
                    ))
                }
            </div>
                <form className="Chat_Content" onSubmit={handleSubmit}>
                    <div className="Content_Text">
                        <input 
                            name="chat" 
                            type='text'  
                            placeholder='Type something...'
                            value={text} onChange={e => setText(e.target.value)}
                        >
                        </input>
                    </div>
                    <div className='Emoji_Chat'>
                        <img src={Smile} style={{width:"25px", height:"25px"}} alt="" onClick={e => setEmojiOpened((prev) => !prev)}/>
                        <div className="Picker_Chat">
                            {emojiOpened ? <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_LIGHT}/> : ""}
                        </div>
                    </div>
                    <div className="Content_Media">
                        <label htmlFor="file-input">
                            <img src={Photo} alt="" style={{width:"25px", height:"25px"}}/>
                        </label>
                        <input type="file" name="file" id="file-input" multiple accept="image/*,video/*" onClick={() => setEmojiOpened(false)} onChange={handleChangeMedia}/>
                    </div>
                    <div className="Send">
                        <img src={Send} alt="" style={{width:"25px", height:"25px"}} onClick={handleSubmit} />

                    </div>
                </form>
            </div>
        }
    </div>
  )
}

export default Chat