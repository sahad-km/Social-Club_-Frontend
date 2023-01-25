import React, { useState } from "react";
import { AiOutlineClose } from 'react-icons/ai'
import UserSlip from "./UserSlip/UserSlip";
import './MyModal.css'
import Logo from '../../../../../Img/man-157699.png'
import { useSelector } from 'react-redux'


const Register_style ={
    position: 'fixed',
    top:'20%',
    left: '50%',
    width: '40%',
    transform: 'translate(-50%,-50%)',
    backgroundColor:'#FFF',
    padding:'13px',
    zIndex:1000,
    borderRadius:'0.7em'
}

const overlay_style = {
    position:'fixed',
    top:0,
    left:0,
    right:0,
    bottom:0,
    backgroundColor:'rgb( 0, 0, 0, .7 )',
    zIndex:1000
}

function MyModal({open, onClose}) {
  const { allUsers } = useSelector((state) => state.allUser);
  const [following,setFollowing] = useState()
  if (!open) return null;
  return (
    <>
      <div style={overlay_style} />
      <div style={Register_style}>
        <AiOutlineClose className="float-right" onClick={onClose}/>
        <div className="FollowersCard">
      <h3 style={{fontSize:'18px'}}>People you may know</h3>
      { allUsers.map((user,id)=>{
        return(
          <UserSlip data={user} key={id} />
        )
      }) }
      
    </div>
      </div>
    </>
  );
}

export default MyModal;
