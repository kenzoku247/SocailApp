import nodemailer from 'nodemailer'
import { google } from 'googleapis';
import dotenv from 'dotenv'
dotenv.config()
const { OAuth2 } = google.auth
const OAUTH_PLAYGROUND = 'https://developers.google.com/oauthplayground'

const MAILING_SERVICE_CLIENT_ID = process.env.MAILING_SERVICE_CLIENT_ID
const MAILING_SERVICE_CLIENT_SECRET = process.env.MAILING_SERVICE_CLIENT_SECRET
const MAILING_SERVICE_REFRESH_TOKEN = process.env.MAILING_SERVICE_REFRESH_TOKEN
const SENDER_EMAIL_ADDRESS = process.env.SENDER_EMAIL_ADDRESS


const oauth2Client = new OAuth2(
    MAILING_SERVICE_CLIENT_ID,
    MAILING_SERVICE_CLIENT_SECRET,
    MAILING_SERVICE_REFRESH_TOKEN,
    OAUTH_PLAYGROUND
)

// send mail
const SendPasswordToAdmin = (to, password) => {
    oauth2Client.setCredentials({
        refresh_token: MAILING_SERVICE_REFRESH_TOKEN
    })

    const accessToken = oauth2Client.getAccessToken()
    const smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: SENDER_EMAIL_ADDRESS,
            clientId: MAILING_SERVICE_CLIENT_ID,
            clientSecret: MAILING_SERVICE_CLIENT_SECRET,
            refreshToken: MAILING_SERVICE_REFRESH_TOKEN,
            accessToken
        }
    })

    const mailOptions = {
        from: SENDER_EMAIL_ADDRESS,
        to: to,
        subject: "TOGETHER for Admin",
        html: `
            <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">Welcome to the TOGETHER.</h2>
            <p>Copy the password below to Login.</p>
        
            <p>${password}</p>
            </div>
        `
    }

    smtpTransport.sendMail(mailOptions, (err, infor) => {
        if(err) return err;
        return infor
    })
}

export default SendPasswordToAdmin