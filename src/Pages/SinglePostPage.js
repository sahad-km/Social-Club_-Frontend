import React from 'react'
import SinglePost from '../Components/Single Post/SinglePost'

function SinglePostPage() {
  return (
    <div className='row' style={{display:"flex", justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>
        <SinglePost/>
    </div>
  )
}

export default SinglePostPage;