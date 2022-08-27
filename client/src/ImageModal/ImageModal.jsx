import React, { useRef, useState } from 'react'
import { Modal, useMantineTheme } from '@mantine/core';
import './ImageModal.css'
import { useDispatch } from 'react-redux';

const ImageModal = ({openImage, setOpenImage, image}) => {
    const theme = useMantineTheme();

    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            size='auto'
            // fullscreen
            transition="fade"
            transitionDuration={600}
            transitionTimingFunction="ease"
            opened = {openImage}
            onClose = {()=> {
                setOpenImage(false);
            }}
        >
            <div className='ImageModal'>
                {
                    image && image.match(/video/i)
                    ?   <video controls 
                        // src={img.url} alt={img.url}
                        className='ImageOnModal'>
                            <source src={image} type="video/mp4"></source>
                        </video>
                    : <img src={image} alt="" className='ImageOnModal'/>
                }
                
            </div>
        </Modal>
    )
}

export default ImageModal