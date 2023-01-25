import React, { Fragment, useState, useEffect,useRef } from 'react'
import Logo from '../../../../Social Club Logo.png'
import { format } from "timeago.js";
import { useSelector } from 'react-redux';
import './RightModal.css'

function RigthModal({data}) {
  const ref = useRef(null);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  useEffect(() => {
      ref.current.scrollIntoView({ behavior: 'smooth' });
  }, []);
  return (
    <Fragment>
   
    <div ref={ref} className="commentCard">
      <div>
        <img
          src={data.user[0].profilePicture}
          alt="profile"
          className="commentsBy"
        />
        <div className="nameofComment">
        <span>{data.user[0].userName}</span>
        <span>{data.comment}</span>
          <span>{format(data.createdAt)}</span>
        </div>
      </div>
    </div>
    <hr style={{backgroundColor: isDarkMode ? "#1a1919" : "#FFF"}} ></hr>
    </Fragment>
  )
}

export default RigthModal