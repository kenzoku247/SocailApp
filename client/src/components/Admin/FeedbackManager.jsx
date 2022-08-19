import React, { useEffect, useState } from 'react'
import { deleteFeedback, solvedFeedback } from '../../redux/actions/adminAction'
import { GLOBAL_TYPES } from '../../redux/actions/globalTypes'
import { getAdminDataAPI } from '../../utils/fetchData'
import Sort from '../../images/sort.png'
import './Admin.css'

const FeedbackManager = ({admin, dispatch, authData, socket}) => {
    const [search, setSearch] = useState('')
    const [readMore, setReadMore] = useState(false)
    const [users, setUsers] = useState([])
    const [feedbacks, setFeedbacks] = useState([])
    const [sortStatus, setSortStatus] = useState(false)
    useEffect(() => {
        if (search.length === 0) {
            setUsers([])
        }
    }, [search.length])

    const handleSort = () => {
        if (sortStatus) {
            admin.feedbacks = admin.feedbacks.sort((a, b) => b.solved - a.solved)
        } else {
            admin.feedbacks = admin.feedbacks.sort((a, b) => a.solved - b.solved)
        }
        setSortStatus(!sortStatus)
    }

    const handleAddFeedback = (id,solved) => {
        if (feedbacks.every(feedback => feedback.id !== id))
            {   
                setFeedbacks([...feedbacks, {id,solved}])
            }
        else {
            setFeedbacks(feedbacks.filter(feedback => feedback.id !== id))
        }
    }


    const handleSolvedFeedback = ({id,newSolved}) => {
        if(window.confirm('have you solved (not solved) this feedback?')){
            dispatch(solvedFeedback({id,newSolved,admin,authData}))
        }
    }

    const handleSolvedFeedbacks = (feedbacks) => {
        if(window.confirm('have you solved (not solved) these feedbacks?')){
            feedbacks.map(feedback => dispatch(solvedFeedback({id: feedback.id,newSolved: !feedback.solved,admin,authData})))
        }
    }

    const handleDeleteFeedback = (id) => {
        if(window.confirm('Do you want to delete this feedback?')){
            dispatch(deleteFeedback({id,admin,authData}))
        }
    }

    const handleDeleteFeedbacks = (feedbacks) => {
        if(window.confirm('Do you want to delete these post?')){
            feedbacks.map(feedback => dispatch(deleteFeedback({id: feedback.id,admin,authData})))
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault()

        try {
            const res = await getAdminDataAPI(`search?fullName=${search}` , authData.token)
            setUsers(res.data.users)
        } catch (err) {
            dispatch({
                type: GLOBAL_TYPES.ALERT, payload: {error: err.response.data.msg}
            })
        }
    }

  return (
    <div className='FeedbackManager'>
        <h3>Manager Feedbacks</h3>
        <div className="FeedbackList">
            <div className="FeedbackListHeader">
                <h5>Feedbacks list</h5>
                <form action="" onSubmit={handleSearch}>
                    <input 
                        className='input-search' 
                        type='text' 
                        placeholder='Search User'
                        onChange={e => setSearch(e.target.value)}
                        value={search}
                    />
                </form>
                {feedbacks.length > 0 && 
                <>
                    <button className='button' onClick={() => handleDeleteFeedbacks(feedbacks)}>Delete Selected Feedbacks</button>
                    <button className='button' onClick={() => handleSolvedFeedbacks(feedbacks)}>Solved (Unsolved) Feedbacks</button>
                </>
                }
            </div>
            <div className="FeedbackListField">
                <div className="FieldFeedbackName">
                    <h6></h6>
                    <h6>User</h6>
                    <h6>Content</h6>
                    <div className='SortContent'>
                        <h6>Status</h6>
                        <img 
                            src={Sort} 
                            alt="" 
                            className='SortIcon' 
                            onClick={handleSort}
                            style={{"cursor":"pointer"}}
                        />
                    </div>
                    <h6>Modify</h6>
                </div>
                <div className="InfoFeedback">
                { (search.length > 0 && users.length > 0) 
                    ? users.map(user => admin.feedbacks.filter(feedback => feedback.sender === user._id).map(data =>
                        <div key={data._id}>
                            <div style={{"display":"flex","justifyContent":"center","alignItems":"center"}}>
                                <input type="checkbox" name="" id="" onClick={() => handleAddFeedback(data._id)}/>
                            </div>
                            <h6>{admin.users.find(user => user._id === data.sender).fullName}</h6>
                            <h6 style={{"textAlign":"justify"}}>
                                {
                                data.content.length < 24 
                                ? data.content 
                                : readMore ? data.content + ' ' : data.content.slice(0, 24) + '...'
                                }
                                {
                                    data.content.length >= 24 &&
                                    <span className="readMore" onClick={() => setReadMore(!readMore)} style={{cursor:"pointer",color:"blue"}}>
                                        {readMore ? '  Hide content' : '  Read more'}
                                    </span>
                                }
                            </h6>
                            <h6>{data.solved ? "Solved" : "Unsolved"}</h6>
                            <div className='ModifyButton'> 
                                <button className='button' onClick={() => handleSolvedFeedback({id:data._id,newSolved:!data.solved})}>{data.solved ? "Unsolved" : "Solved"}</button>
                                <button className='button' onClick={() => handleDeleteFeedback(data._id)}>Delete</button>
                            </div>
                        </div>
                    ))
                    : admin.feedbacks.map(feedback => 
                        <div key={feedback._id}>
                            <div style={{"display":"flex","justifyContent":"center","alignItems":"center"}}>
                                <input type="checkbox" name="" id="" onClick={() => handleAddFeedback(feedback._id,feedback.solved)}/>
                            </div>
                            <h6>{admin.users.find(user => user._id === feedback.sender).fullName}</h6>
                            <h6 style={{"textAlign":"justify"}}>
                                {
                                feedback.content.length < 24 
                                ? feedback.content 
                                : readMore ? feedback.content + ' ' : feedback.content.slice(0, 24) + '...'
                                }
                                {
                                    feedback.content.length > 24 &&
                                    <span className="readMore" onClick={() => setReadMore(!readMore)} style={{cursor:"pointer",color:"blue"}}>
                                        {readMore ? '  Hide content' : '  Read more'}
                                    </span>
                                }
                            </h6>
                            <h6>{feedback.solved ? "Solved" : "Unsolved"}</h6>
                            <div className='ModifyButton'>
                                <button className='button' onClick={() => handleSolvedFeedback({id:feedback._id,newSolved:!feedback.solved})}>{feedback.solved ? "Unsolved" : "Solved"}</button>
                                <button className='button' onClick={() => handleDeleteFeedback(feedback._id)}>Delete</button>
                            </div>
                        </div>
                        )
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default FeedbackManager