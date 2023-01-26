import React from 'react'
import SinglePost from '../Components/Single Post/SinglePost'

function SinglePostPage() {
    console.log("evide enkilum")
  return (
    <div className='row' style={{display:"flex", justifyContent:'center',alignItems:'center',minHeight:'100vh'}}>
        <SinglePost/>
    </div>
  )
}

export default SinglePostPage;