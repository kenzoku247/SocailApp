import React, { useState } from 'react'
import './About.css'
import Avatar1 from '../../images/avatarPhuc.jpg'
import Avatar2 from '../../images/avatarHiep.jpg'
import Avatar3 from '../../images/avatarTruong.jpg'
import Facebook from '../../images/facebook.png'
import Gmail from '../../images/gmail.png'
import Back from '../../images/arrowBack.png'
import LogoKMA from '../../images/logoKMA.png'
import { Link } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux'
import { createFeedback } from '../../redux/actions/feedbackAction'


const About = () => {
  const { authData } = useSelector(state => state.auth)
  const { _id } = authData.user
  const githubLink ='https://github.com/kenzoku247/SocialApp'
  const backendLink = 'https://github.com/devat-youtuber/MERN-Stack-Build-a-social-media-app'
  const frontendLink = 'https://github.com/ZainRk/SocialMedia-Frontend'
  const facebookPhuc = 'https://www.facebook.com/hogfuc'
  const gmailPhuc = 'vuphuc365@gmail.com'
  const facebookHiep= 'https://www.facebook.com/profile.php?id=100007126178725'
  const gmailHiep = 'hiepga123409@gmail.com'
  const facebookTruong = 'https://www.facebook.com/Narutobu'
  const gmailTruong = 'nick190901@gmail.com'
  const [content, setContent] = useState('')

  const dispatch = useDispatch()

  const handleSubmit =(e) => {
    e.preventDefault()
    setContent('')
    dispatch(createFeedback({id: _id, content, authData}))
    // console.log(content);
  }

  return (
    <div className='About'>
      <div className="HeaderAbout">
        <Link to={'/'}>
          <img src={Back} alt="" />
          <h5>Home</h5>
        </Link>
      </div>
      <div></div>
      <div className='BodyAbout'>
        <div className="LeftAbout">
          <h3>Our Team</h3>
          <div className="CardsTeam">
            <div className="ImagesTeam">
              <div className='HalfCircle'></div>
              <img src={Avatar1} alt="" />
              <h4 >Vũ Hồng Phúc</h4>
              <h6>Web Develop</h6>
              <div className='LinkInfo'>
                <a href={facebookPhuc}><img src={Facebook} alt="" /></a>
                <a href={`mailto:${gmailPhuc}?subject=SendMail&body=Description`}><img src={Gmail} alt="" /></a>
                {/* <a href={`mailto:${gmailPhuc}`}><img src={Gmail} alt="" /></a> */}
                <div className='Rectangle_IT'></div> 
              </div>
            </div>
            <div className="ImagesTeam">
              <div className='HalfCircle'></div>
              <img src={Avatar2} alt="" />
              <h4>Nguyễn Văn Hiệp</h4>
              <h6>Diagram and Presentation</h6>
              <div className='LinkInfo'>
                <a href={facebookHiep}><img src={Facebook} alt="" /></a>
                <a href={`mailto:${gmailHiep}`}><img src={Gmail} alt="" /></a>
                <div className='Rectangle_IT'></div>
              </div>
            </div>
            <div className="ImagesTeam">
              <div className='HalfCircle'></div>
              <img src={Avatar3} alt="" />  
              <h4>Trịnh Đức Trường</h4>
              <h6>Slide and Report</h6>
              <div className='LinkInfo'>
                <a href={facebookTruong}><img src={Facebook} alt="" /></a>
                <a href={`mailto:${gmailTruong}`}><img src={Gmail} alt="" /></a>
                <div className='Rectangle_IT'></div>
              </div>
            </div>
          </div>
          <div className="SchoolInfo">
            <a href={'https://www.actvn.edu.vn/'}><h4>Học viện Kỹ Thuật Mật Mã</h4></a>
            <h6>Ban cơ yếu chính phủ</h6>
            <a href={'https://www.actvn.edu.vn/'}><img src={LogoKMA} alt="" /></a>
          </div>
        </div>
        <div className="RightAbout" >
          <h3>Feedback Box</h3>
          <div className="BoxContent">
            <h5>Hãy gửi phản hồi của bạn cho chúng tôi, để có thể khắc phục và mang lại một trải nghiệm tốt nhất cho bạn.</h5>
            <textarea 
              name="" 
              id="" 
              cols="50" 
              rows="5"
              onChange={e => setContent(e.target.value)}
              value={content}
              >
              
            </textarea>
            <button className='button' onClick={handleSubmit} disabled={content.length === 0 ? true : false}>Gửi</button>
            <h5>Hoặc có thể phản hồi trực tiếp đến các Admin thông qua Gmail hoặc Facebook.</h5>
          </div>
          <div className="SourceCode">
            <h5>Dự án được phát triển dựa trên 2 nguồn: </h5>
            <ul>
              <li>Back-end: <a href={`${backendLink}`}>{backendLink}</a></li>
              <li>Front-end: <a href={`${frontendLink}`}>{frontendLink}</a></li>
            </ul>
            <h5>Source Code sẽ được public trên Github vào ngày 24/08/2022.</h5>
            <h5>Sau cùng, nhóm xin chân thành cảm ơn mọi người đã chú ý, quan tâm và góp ý.</h5>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default About