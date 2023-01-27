import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import Loader from '../../Loader/Loader'
import './ProfileCard.css'
import Logo from '../../../Social Club Logo.png'
import altProfile from '../../../Img/man-157699.png'
import Share from '../../../Components/Home/Share/Share'
import Posts from '../../Home/PostSide/AllPosts/Posts'


function ProfileCard() {
  const { user } = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  if(!user) return <Loader/>
  return (
    <Fragment>
    <div className='col-md-6 mainDiv' >
    <div className={`ProfileCard ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
    <div className="ProfileImages">

    { user.coverPicture ? <img style={{backgroundColor:'orange',height:'10em'}} src={user.coverPicture} alt=''/> 
     : <img style={{backgroundColor:'orange',height:'95px'}} src={Logo} alt={Logo} /> }
     { user.profilePicture ? <img style={{backgroundColor:'black',height:'6em'}} src={user.profilePicture} alt="ProfileImage"/> 
     : <img style={{backgroundColor:'orange',height:'95px'}} src={altProfile} alt={altProfile} /> }
    </div>
    <div className="ProfileName">
     { user.firstName && user.lastName ? <span>{user.firstName} {user.lastName}</span> : <span>{user.userName}</span> } 
      <span>{user.worksAs}</span>
    </div>

    <div className="followStatus">
      <div className='hr'></div>
      <div>
        <div className="follow">
          <span>{user.followers.length}</span>
          <span>Followers</span>
        </div>
        <div className="vl"></div>
        <div className="follow">
          <span>{user.following.length}</span>
          <span>Following</span>
        </div>
        <div className="vl"></div>
        <div className="follow">
          <span>{user.postCount ? user.postCount : 0}</span>
          <span>Posts</span>
        </div>
      </div>
      <div className='hr'></div>
    </div>
  </div>
  <Share/>
  <Posts/>
  </div>
  </Fragment>

  )
}

export default ProfileCard