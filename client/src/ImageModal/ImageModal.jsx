import React, { useRef, useState } from 'react'
import { Modal, useMantineTheme } from '@mantine/core';
import './ImageModal.css'
import { useDispatch } from 'react-redux';

const ImageModal = ({openImage, setOpenImage, image}) => {
    const theme = useMantineTheme();
    const dispatch = useDispatch()

    return (
        <Modal
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.55}
            overlayBlur={3}
            size='100%'
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

                <img src={image} alt="" className='ImageOnModal'/>
            </div>
        </Modal>
    )
}

export default ImageModal