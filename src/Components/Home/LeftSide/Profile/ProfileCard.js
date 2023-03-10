import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../../SearchBar/SearchBar";
import { useSelector, useDispatch } from "react-redux";
import jwtDecode from "jwt-decode";
import Loader from "../../../Loader/Loader";
import { setUser } from "../../../../redux/actions/userAction";
import Logo from "../../../../Img/No-Cover.png";
import altProfile from "../../../../Img/man-157699.png";
import "./ProfileCard.css";

function ProfileCard() {
  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token.token);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const dispatch = useDispatch();

  if(!user) return <Loader/>;
  return (
    <div className="col-md-3">
      <SearchBar/>
      <div className={`ProfileCard ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
        <div className="ProfileImages">
          { user.coverPicture ? <img style={{height:'95px'}} src={user.coverPicture} alt={Logo} /> 
     : <img style={{height:'95px'}} src={Logo} alt={Logo} /> }
     { user.profilePicture ? <img style={{height:'95px'}} src={user.profilePicture} alt={Logo} /> 
     : <img style={{height:'95px'}} src={altProfile} alt={altProfile} /> }
        </div>
        <div className="ProfileName">
          <span>{user.userName}</span>
          {user.worksAs  && <span>{user.worksAs}</span>}
        </div>

        <div className="followStatus">
          <div className="hr"></div>
          <div>
            <div className="follow">
            {user.followers ? <span>{user.followers.length}</span> : 0}
              <span>Followers</span>
            </div>
            <div className="vl"></div>
            <div className="follow">
            {user.following ? <span>{user.following.length}</span> : 0}
              <span>Following</span>
            </div>
          </div>
          <div className="hr"></div>
        </div>
        <span>
          <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "inherit" }}>
            My Profile
          </Link>
        </span>
      </div>
    </div>
  );
}

export default ProfileCard;
