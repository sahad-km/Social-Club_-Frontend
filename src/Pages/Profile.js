import React, { Fragment, useEffect } from "react";
import DetailCard from "../Components/Profile/DetailCard/DetailCard";
import ProfileCard from "../Components/Profile/CenterDiv/ProfileCard";
import RightSide from "../Components/Home/RightSide/RightSide";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/actions/userAction";
import { toast } from "react-toastify";

const toastConfig = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Check user logout or not 
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      dispatch(logout())
      toast.error("Session expired, Please login to continue", toastConfig)
      navigate('/login');
    }
  },[])
  return (
    <Fragment>
      <div className="row">
        <DetailCard />
        <ProfileCard/>
        <RightSide/>
      </div>
    </Fragment>
  );
}

export default Profile;
