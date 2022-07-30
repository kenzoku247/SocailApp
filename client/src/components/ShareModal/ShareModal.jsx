import React from 'react'
import { Modal, useMantineTheme } from "@mantine/core";
import { useDispatch } from 'react-redux';
import {
    EmailShareButton, EmailIcon,
    FacebookShareButton, FacebookIcon,
    TwitterShareButton, TwitterIcon,
} from 'react-share'
import './ShareModal.css'

const ShareModal = ({onShare, setOnShare, url}) => {
    const theme = useMantineTheme();
    const dispatch = useDispatch();
  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="20%"
      opened={onShare}
      onClose={() => {
        setOnShare(false)
      }}
    >
        <h4>Share</h4>
        <div className="Share_Social">
            <FacebookShareButton url={url} >
                <FacebookIcon round={true} size={40} />
                Facebook
            </FacebookShareButton>
            <EmailShareButton url={url} >
                <EmailIcon round={true} size={40} />
                Email
            </EmailShareButton>
            <TwitterShareButton url={url} >
                <TwitterIcon round={true} size={40} />
                Twitter
            </TwitterShareButton>
        </div>
    </Modal>
  )
}

export default ShareModal