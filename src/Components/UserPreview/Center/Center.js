import React from 'react'
import Logo from '../../../Social Club Logo.png'
import altProfile from '../../../Img/man-157699.png'
import { useSelector } from 'react-redux'
import './Center.css'
import Posts from '../../Home/PostSide/AllPosts/Posts'
import Loader from '../../Loader/Loader'

function Center({data}) {
  const isDarkMode = useSelector((state) => state.isDarkMode);
console.log("first,sec",data)
if(!data) return <Loader/>
  return (
    <div className='col-md-6 mainDiv'>
    <div className={`ProfileCard ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
    <div className="ProfileImages">
      { data.coverPicture ? <img style={{backgroundColor:'orange',height:'10em'}} src={data.coverPicture} alt={Logo} /> 
     : <img style={{backgroundColor:'orange',height:'10em'}} src={Logo} alt="CoverImage" /> }
     { data.profilePicture ? <img style={{backgroundColor:'black',height:'6em'}} src={data.profilePicture} alt={Logo} /> 
     : <img style={{backgroundColor:'orange',height:'10em'}} src={altProfile} alt={altProfile} /> }
    </div>
    <div className="ProfileName">
      <span>{data.firstName} {data.lastName}</span>
      <span>{data.worksAs}</span>
    </div>

    <div className="followStatus">
      <div className='hr'></div>
      <div>
        <div className="follow">
          <span>{data.followers.length}</span>
          <span>Followers</span>
        </div>
        <div className="vl"></div>
        <div className="follow">
          <span>{data.following ? data.following.length : 0}</span>
          <span>Following</span>
        </div>
        <div className="vl"></div>
        <div className="follow">
          <span>{data.postCount}</span>
          <span>Posts</span>
        </div>
      </div>
      <div className='hr'></div>
    </div>
  </div>
  <Posts/>
  </div>
  )
}

export default Center