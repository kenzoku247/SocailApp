import React from 'react'
import { useSelector } from 'react-redux'
import ZoomIn from '../images/zoomIn.png'
import ImageModal from '../ImageModal/ImageModal'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Carousel = ({post}) => {

    const [image, setImage] = useState()

    const [openImage, setOpenImage] = useState(false)
    const isActive = index => {
        if(index === 0) return "active";
    }

    const { theme } = useSelector(state => state)

    return (
        <div id={`image${post._id}`} className="carousel slide" data-bs-ride="carousel">
            <div className="carousel-indicators" style={{zIndex: 1}}>
                {
                    post.images.map((img, index) => (
                    <button type="button" key={index} data-bs-target={`#image${post._id}`} 
                        data-bs-slide-to={index} className={isActive(index)}></button>
                    ))
                }
                
            </div>

            <div className="carousel-inner">
                {
                    post.images.map((img, index) => (
                        <div key={index} className={`carousel-item ${isActive(index)}`}  >
                            <Link to={`/post/${post._id}`} className="d-flex">
                                {
                                    img.url.match(/video/i)
                                    ? <video controls src={img.url} alt={img.url}
                                    style={{filter: theme ? 'invert(1)' : 'invert(0)'}} />
                                    
                                    : <img src={img.url}  alt={img.url}
                                    style={{filter: theme ? 'invert(1)' : 'invert(0)',maxHeight:'70vh',width:'auto',maxWidth: '600px'}} />
                                }
                            </Link>
                            <div className="Zoom_In">
                                <img src={ZoomIn} alt="" onClick={() => {setOpenImage(true);setImage(img.url)}}/>
                            </div>
                            <ImageModal openImage={openImage} setOpenImage={setOpenImage} image={image}/>
                        </div>
                    ))
                }
                
            </div>
            
            {
                post.images.length > 1 &&
                <>
                    <button className="carousel-control-prev" data-bs-target={`#image${post._id}`} type="button" data-bs-slide="prev"
                    style={{width: '5%'}}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>

                    <button className="carousel-control-next" data-bs-target={`#image${post._id}`} type="button" data-bs-slide="next"
                    style={{width: '5%'}}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </>
            }
            
        </div>
    )
}

export default Carousel
