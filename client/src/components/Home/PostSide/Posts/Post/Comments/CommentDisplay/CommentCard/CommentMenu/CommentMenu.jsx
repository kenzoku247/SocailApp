import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteComment } from '../../../../../../../../../redux/actions/commentAction'
import More from '../../../../../../../../../images/more.png'
import './CommentMenu.css'

const CommentMenu = ({post, comment, setOnEdit}) => {

    const {  socket } = useSelector(state => state)
    const { authData } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    const handleRemove = () => {
        if(post.user._id === authData.user._id || comment.user._id === authData.user._id){
            dispatch(deleteComment({post, authData, comment, socket}))
        }
    }

    const MenuItem = () => {
        return(
            <>
                <li>
                    <button className="dropdown-item" onClick={() => setOnEdit(true)}>
                        <span className="material-icons">create</span> Edit
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={handleRemove}>
                        <span className="material-icons">delete_outline</span> Remove
                    </button>
                </li>
            </>
        )
    }
  return (
    <div className='CommentMenu'>
        {
            (post.user._id === authData.user._id || comment.user._id === authData.user._id) &&
            <div className="dropdown">
                <button className="button ps-button cm-button " id="dropdownMenu2" data-toggle="dropdown" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src={More} alt="" />
                </button>

                <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                    {
                        post.user._id === authData.user._id
                        ? comment.user._id === authData.user._id
                            ? MenuItem()
                            : <div className="dropdown-item" onClick={handleRemove}>
                                <span className="material-icons">delete_outline</span> Remove
                            </div>
                        : comment.user._id === authData.user._id && MenuItem()
                    }
                </ul>

            </div>
        }
    </div>
  )
}

export default CommentMenu