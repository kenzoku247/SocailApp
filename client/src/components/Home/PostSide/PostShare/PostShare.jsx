import React, { useState, useRef, useEffect } from "react";
import "./PostShare.css";
import Picker from 'emoji-picker-react';
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GLOBAL_TYPES } from "../../../../redux/actions/globalTypes";
import { createPost, updatePost } from "../../../../redux/actions/postAction";
import { imageShow, videoShow } from "../../../../utils/mediaShow";
import PostModal from "../../../PostModal/PostModal";


const PostShare = () => {
  const { authData } = useSelector(state => state.auth)
  const { user } = authData
  const { status } = useSelector(state => state)
  
  const dispatch = useDispatch()
  // const refCanvas = useRef()

  return (
    <div className="PostShare">
      <Link to={`/profile/${user._id}`}>
        <img src={user.avatar} alt="" />
      </Link>
      <div>
        <button className="statusButton"
          onClick={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })}>
            {authData.user.fullName}, what are you thinking?
        </button>
        <div className="postOptions">
          <div className="option" style={{ color: "var(--photo)" }}
          onClick={ () => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })

          }>
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}
          onClick={ () => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })

          }>
            <UilPlayCircle />
            Video
          </div>
          <div className="option" style={{ color: "var(--location)" }}
          onClick={ () => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })
          }>
            <UilLocationPoint />
            Location
          </div>{" "}
          <div className="option" style={{ color: "var(--schedule)" }}
          onClick={ () => dispatch({ type: GLOBAL_TYPES.STATUS, payload: true })
          }>
            <UilSchedule />
            Schedule
          </div>
        </div>
      </div>
      { status && 
        <PostModal/>  
      }
    </div>
  );
};

export default PostShare;