import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import VideoCall from '../Components/VideoCall/VideoCall'
import { logout } from '../redux/actions/userAction';

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

function VideoCallPage() {
  const dispatch = useDispatch();

  //Check user logout or not
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
    <div>
      <VideoCall/>
    </div>
  )
}

export default VideoCallPage