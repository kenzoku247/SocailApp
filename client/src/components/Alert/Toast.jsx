import React from 'react'
import './Toast.css'

const Toast = ({msg, handleShow, bgColor}) => {
    return (
        <div className="Toast" style={{backgroundColor: bgColor}}>
            <div className="Header">
                <strong className="Title">{msg.title}</strong>
                <button className="Button"
                data-dismiss="toast" 
                onClick={handleShow}>
                    &times;
                </button>
            </div>
            <div className="Body">
                {msg.body}
            </div>
        </div>
    )
}

export default Toast
