import React, { Fragment, useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChatUser } from "../../../redux/actions/chatAction";
import altProfile from "../../../Img/man-157699.png";
import "./Conversation.css";

function FriendSlip({ data, currentUser, online }) {
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token.token);
  const dispatch = useDispatch();

  useEffect(() => {
  if(data && data.members){
  const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        fetch(`${process.env.REACT_APP_BACKEND}/dashboard/${userId}`,{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": `${token}`,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            setUserData(json.details);
            dispatch(setChatUser(json.details))
          });
      } catch (error) {
        console.log(error);
      }
    };
    getUserData();
  }
  }, []);

  return (
    <Fragment>
      <div style={{padding:'10px',marginBottom:'0'}} className="follower">
        <div>
         {online && <div className="online-dot"></div>}
          {userData?.profilePicture? <img src={userData.profilePicture} alt="Profile" className="followerImage" style={{ width: "50px", height: "50px" }}/> : 
          <img src={altProfile} alt="Profile" className="followerImage" style={{ width: "50px", height: "50px" }}/> }
          <div className="name" style={{ fontSize: "0.8rem" }}>
            <span>{userData?.userName}</span>
            <span className={online? "onlineStatus" : "offlineStatus"}>{online? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{width:'85%', border: "0.1px solid #ececec",marginTop:'0'}} />
    </Fragment>
  );
}

export default FriendSlip;