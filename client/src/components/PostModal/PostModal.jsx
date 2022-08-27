import React, { useEffect, useRef, useState } from "react";
import { Modal, useMantineTheme } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { GLOBAL_TYPES } from "../../redux/actions/globalTypes";
import { Link } from "react-router-dom";
import { createPost, updatePost } from "../../redux/actions/postAction";
import { imageShow, videoShow } from "../../utils/mediaShow";
import Picker, { SKIN_TONE_MEDIUM_LIGHT } from 'emoji-picker-react';
import Smile from '../../images/smiling.png'

const PostModal = () => {
  const { authData } = useSelector(state => state.auth)
  const { user } = authData
  const { theme, status, socket} = useSelector(state => state)
  const dispatch = useDispatch()
  const matineTheme = useMantineTheme();

  const [content, setContent] = useState('')

  const [images, setImages] = useState([]);
  const [stream, setStream] = useState(false)
  const videoRef = useRef()
  const refCanvas = useRef()
  const refImage = useRef()
  const [tracks, setTracks] = useState('')

  const [emojiOpened, setEmojiOpened] = useState(false)

  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
      setChosenEmoji(emojiObject);
      setContent(content + emojiObject.emoji)
  }

  const onImageChange = (e) => {
    const files = [...e.target.files]
      let err = ""
      let newImages = []
      files.forEach(file => {
          if(!file) return err = "File does not exist."
          if(file.size > 1024 * 1024 * 10){
              return err = "The image/video largest is 10mb."
          }
          return newImages.push(file)
      })
      if(err) dispatch({ type: GLOBAL_TYPES.ALERT, payload: {error: err} })
      setImages([...images, ...newImages])
  };


  const deleteImages = (index) => {
    const newArr = [...images]
    newArr.splice(index, 1)
    setImages(newArr)
  }

  const handleStream = () => {
    setStream(true)
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
        navigator.mediaDevices.getUserMedia({video: true})
        .then(mediaStream => {
            videoRef.current.srcObject = mediaStream
            videoRef.current.play()

            const track = mediaStream.getTracks()
            setTracks(track[0])
        }).catch(err => console.log(err))
    }
  }

  const handleCapture = () => {
    const width = videoRef.current.clientWidth;
    const height = videoRef.current.clientHeight;

    refCanvas.current.setAttribute("width", width)
    refCanvas.current.setAttribute("height", height)

    const ctx = refCanvas.current.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0, width, height)
    let URL = refCanvas.current.toDataURL()
    setImages([...images, {camera: URL}])
  }

  const handleStopStream = () => {
      tracks.stop()
      setStream(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(status.onEdit){
        dispatch(updatePost({content, images, authData, status}))
    }else{
        dispatch(createPost({content, images, authData, socket}))
    }
    setContent('')
    setImages([])
    dispatch({ type: GLOBAL_TYPES.STATUS, payload: false})
    }

  useEffect(() => {
    if(status.onEdit){
        setContent(status.content)
        setImages(status.images)
    }
  },[status])

  return (
    <Modal
      overlayColor={
        matineTheme.colorScheme === "dark"
          ? matineTheme.colors.dark[9]
          : matineTheme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={status}
      onClose={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: false })}
    >
    <div className="PostShare">
      <Link to={`/profile/${user._id}`} onClick={() => dispatch({ type: GLOBAL_TYPES.STATUS, payload: false })}>
        <img src={user.avatar} alt="" />
      </Link>
      <div>
        <textarea 
          name="content" 
          value={content} 
          type="text" 
          placeholder={user.fullName + ", What's happening" }
          onChange={e => setContent(e.target.value)}
        />
        <div className="Emoji">
          <img src={Smile} style={{width:"25px", height:"25px"}} alt="" onClick={e => setEmojiOpened((prev) => !prev)}/>
          <div className="Picker_Post">
            {emojiOpened ? <Picker  onEmojiClick={onEmojiClick} skinTone={SKIN_TONE_MEDIUM_LIGHT}/> : ""}
          </div>
        </div>
        <div className="postOptions">
          <div className="option" style={{ color: "var(--photo)" }}
          onClick={()=>refImage.current.click()}
          >
            <UilScenery />
            Photo
          </div>
          <div className="option" style={{ color: "var(--video)" }}
          onClick={()=>refImage.current.click()}
          >
            <UilPlayCircle />
            Video
          </div>{" "}
          <div className="option" style={{ color: "var(--location)" }}>
            <UilLocationPoint />
            Location
          </div>{" "}
          <div className="option" style={{ color: "var(--schedule)" }}>
            <UilSchedule />
            Schedule
          </div>
          <button className="button ps-button" onClick={handleSubmit}>Share</button>
          <div style={{ display: "none" }}>
            <input
              type="file"
              name="myImage"
              ref={refImage}
              onChange={onImageChange}
            />
          </div>
        </div>
      { images.length > 0 ? 
        <div className="showImages">
          {images.map((image, index) => (
    
            <div  key={index} id="file_img">
              <span>
                <UilTimes onClick={()=>deleteImages(index)}/>
              </span>
              {
                image.camera 
                ? imageShow(image.camera, theme)
                : image.url
                ?<>
                    {
                        image.url.match(/video/i)
                        ? videoShow(image.url, theme) 
                        : imageShow(image.url, theme)
                    }
                </>
                :<>
                    {
                        image.type.match(/video/i)
                        ? videoShow(URL.createObjectURL(image), theme) 
                        : imageShow(URL.createObjectURL(image), theme)
                    }
                </>
              }
            </div>
          ))}
        </div>
        : "" }
      </div>
    </div>
    </Modal>
  );
};

export default PostModal;
