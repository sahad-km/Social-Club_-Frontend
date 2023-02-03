import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../Components/Home/LeftSide/Profile/ProfileCard";
import RightSide from "../Components/Home/RightSide/RightSide";
import CenterHome from "./CenterHome";
import { logout } from "../redux/actions/userAction";
import { useDispatch } from "react-redux";
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

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      dispatch(logout())
      toast.error("Session expired, Please login to continue", toastConfig)
      navigate('/login');
    }
  },[])
  return (
      <div className="row">
      <ProfileCard/>
      <CenterHome/>
      <RightSide/> 
      </div>
  );
}

export default Home;
