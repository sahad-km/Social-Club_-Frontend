import React from 'react'
import Share from '../Components/Home/Share/Share'
import Posts from '../Components/Home/PostSide/AllPosts/Posts'
import '../Components/Profile/CenterDiv/ProfileCard.css'
function CenterHome() {
 
  return (
    <div className='col-md-6 mainDiv'>
        <Share/>
        <Posts/>
    </div>
  )
}

export default CenterHome