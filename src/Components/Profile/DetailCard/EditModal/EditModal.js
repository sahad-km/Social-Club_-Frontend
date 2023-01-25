import React, { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector,useDispatch } from "react-redux";
import { setUser } from "../../../../redux/actions/userAction";
import Logo from "../../../../Img/man-157699.png";
import './EditModal.css'

const Register_style = {
  position: "fixed",
  top: "50%",
  left: "50%",
  width: "40%",
  transform: "translate(-50%,-50%)",
  backgroundColor: "#FFF",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "0.7em",
};

const overlay_style = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgb( 0, 0, 0, .7 )",
  zIndex: 1000,
};

function EditModal({ open, onClose }) {
  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token.token);
  const dispatch = useDispatch();
  const [firstName,setFirstname] = useState( user.firstName ? user.userName : '');
  const [lastName,setLastname] = useState( user.lastName ? user.lastName : '');
  const [worksAs,setWorksAs] = useState( user.worksAs ? user.worksAs : '');
  const [livesIn,setLivesIn] = useState( user.livesIn ? user.livesIn : '');
  const [country,setCountry] = useState( user.country ? user.country : '');
  const [status,setStatus] = useState( user.relationship ? user.relationship : '');
  const [profileImage,setProfileImage] = useState(null);
  const [coverImage,setCoverImage] = useState(null);

  const uploadImage = async (e) => {
    e.preventDefault();
    const data = new FormData()
    data.append('file',profileImage)
    data.append("upload_preset",'wj1iznqd')
    data.append("cloud_name",'dupfwiwnp')
  
    fetch(" https://api.cloudinary.com/v1_1/dupfwiwnp/image/upload",
    {
      method:'post',
      body:data
    })
    .then(res => res.json())
    .then(response => {
      console.log(response.url)
      const profileUrl = response.url
      const data = new FormData()
      data.append('file',coverImage)
      data.append("upload_preset",'wj1iznqd')
      data.append("cloud_name",'dupfwiwnp')
  
      fetch(" https://api.cloudinary.com/v1_1/dupfwiwnp/image/upload",
      {
      method:'post',
      body:data
      })
      .then(res => res.json())
      .then(data => {
      console.log(data.url)
      const coverUrl = data.url
      updateUser(profileUrl,coverUrl)
      })
      })
      .catch(err => console.log(err))
  }

  const updateUser = (profileUrl,coverUrl) => {
    fetch('http://localhost:8000/register/insert_details' ,{  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Custom-Header": `${token}`,
      },
      body: JSON.stringify({
          firstName,
          lastName,
          worksAs,
          livesIn,
          country,
          status,
          profileUrl,
          coverUrl,
          userId:user._id
      }),
    })
    .then(res => res.json())
    .then(data => {
      dispatch(setUser(data.details));
      onClose();
      console.log("Uploaded successfully")
    })
  }

  if (!open) return null;
  return (
    <>
      <div style={overlay_style} />
      <div style={Register_style}>
        <AiOutlineClose className="float-right" onClick={onClose} />
        <h3>Your Info</h3>

<form>
  <div class="form-row infoForm">
    <div class="form-group col-md-6">
      <input value={firstName} onChange={(e) => { setFirstname(e.target.value)}} type="text" class="infoInput" id="inputEmail4" placeholder="First Name"></input>
    </div>
    <div class="form-group col-md-6">
      <input value={lastName} onChange={(e) => { setLastname(e.target.value)}} type="text" class="infoInput" id="inputPassword4" placeholder="Last Name"></input>
    </div>
  </div>
  <div class="form-group">
    <input value={worksAs} onChange={(e) => { setWorksAs(e.target.value)}} type="text" class="infoInput" id="inputAddress" placeholder="Works as"></input>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
      <input value={livesIn} onChange={(e) => { setLivesIn(e.target.value)}} type="text" class="infoInput" id="inputEmail4" placeholder="Lives In"></input>
    </div>
    <div class="form-group col-md-6">
      <input value={country} onChange={(e) => { setCountry(e.target.value)}} type="text" class="infoInput" id="inputPassword4" placeholder="Country"></input>
    </div>
  </div>
  <div class="form-group">
  <select value={status} onChange={(e) => { setStatus(e.target.value)}} id="inputState" class="infoInput">
        <option defaultValue >Relationship Status</option>
        <option>Single</option>
        <option>Married</option>
      </select>
  </div>

  <div class="form-row">
    <div class="form-group col-md-6">
    <label for="profilePic">Upload Profile Picture</label>
    <input onChange={(e) => { setProfileImage(e.target.files[0])}} type="file" class="infoInput" id="profilePic"></input>
    </div>
    <div class="form-group col-md-6">
    <label for="coverPic">Upload Cover Picture</label>
    <input onChange={(e) => { setCoverImage(e.target.files[0])}} type="file" class="infoInput" id="coverPic"></input>
    </div>
  </div>
  <button className="button logout-button" onClick={(e)=>{uploadImage(e)}} >Update</button>
</form>
      </div>
    </>
  );
}

export default EditModal;