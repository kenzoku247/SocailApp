import React from 'react'
import './Toast.css'
import { useEffect, useState } from 'react'

const Toast = ({msg, handleShow, bgColor}) => {
    const [show, setShow] = useState(true)

    useEffect(() => {
        const timeId = setTimeout(() => {
          setShow(false)
        }, 3500)
    
        return () => {
          clearTimeout(timeId)
        }
      }, []);
    
    if (!show) {
        return null;
    }
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
