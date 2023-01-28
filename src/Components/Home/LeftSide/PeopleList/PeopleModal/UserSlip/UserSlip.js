import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../MyModal.css";
import Logo from '../../../../../../Img/man-157699.png'
import { useDispatch, useSelector } from "react-redux";
import { followUser, unFollowUser } from "../../../../../../redux/actions/userAction";

function UserSlip({data}) {
    const user = useSelector((state) => state.user.user);
    const token = useSelector((state) => state.token.token);
    const dispatch = useDispatch();
    const [following,setFollowing] = useState(data.followers ? data.followers.includes(user._id) : false);

    const followFunction = (e) => {
        e.preventDefault();
        setFollowing((prev) => !prev);
        fetch(`${process.env.REACT_APP_BACKEND}/dashboard/follow/${data._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
        body: JSON.stringify({
          myId: user._id,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          if(json.status == 'follow'){
            dispatch(followUser(json.id))
          }else{
            dispatch(unFollowUser(json.id))
          }
        });
        
        
      };
  return (
    <div className="follower">
      <div>
        {data.profilePicture ? (
          <img
            className="followerImage"
            src={data.profilePicture}
            alt="No image found"
          />
        ) : (
          <img className="followerImage" src={Logo} alt="" />
        )}
        <div className="name">
          <span><Link to={`/user/${data._id}`} >{data ? data.userName : ''}</Link></span>
        </div>
      </div>
     {data._id !== user._id ? <button onClick={(e) => {followFunction(e)}} className={following ? "button fc-button UnfollowButton" : "button fc-button"}>{following ? "Unfollow" : "Follow"}</button> : ''}
    </div>
  );
}

export default UserSlip;
