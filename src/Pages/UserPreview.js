import React, { Fragment, useEffect, useState } from "react";
import UserPreview from "../Components/UserPreview/LeftSide/UserPreview";
import Center from "../Components/UserPreview/Center/Center";
import RightSide from "../Components/UserPreview/RigthSide/RightSide";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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

function UserPreviewPage() {
  const token = useSelector((state) => state.token.token);
  const [data, setData] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { id } = useParams();

 //Check user logout or not
  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token){
      dispatch(logout())
      toast.error("Session expired, Please login to continue", toastConfig)
      navigate('/login');
    }
  },[])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND}/dashboard/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": `${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        if(json.err){
          navigate('/pageNotFound');
        }else{
        setData(json.details);
        }
      })
  }, [id]);

  return (
    <div className="row" style={{minHeight:'100vh'}} >
      <UserPreview data={data} />
      <Center data={data}/>
      <RightSide data={data} />
    </div>
  );
}

export default UserPreviewPage;
