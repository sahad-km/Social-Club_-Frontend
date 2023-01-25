import React, { Fragment, useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from "react-redux";
import "./TrendingPeople.css";
import { setUser } from "../../../redux/actions/userAction";

function TrendingPeople() {
  const dispatch = useDispatch();
  // useEffect(()=>{
  //   console.log('hida]eas')
  //   const token = localStorage.getItem('token');
  //   if(token){
  //     const decodedToken = jwtDecode(token);
  //    const id = decodedToken.userId;
  //    fetchDetails(id);
  //   }
  //   async function fetchDetails(id){
  //     const response = await fetch(`http://localhost:8000/dashboard/${id}`,{
  //       method: 'GET',
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     console.log('chu chai',data)
  //     dispatch(setUser(data.details));
  //   }
  // })
  return (
    <Fragment>
      <div className="TrendCard">
        <p className="head">Trending People</p>
        <div className="trend">
          <span>#Sahad</span>
          <span>100k shares</span>
        </div>
      </div>
      <button style={{marginBottom:'19.6em'}} className="button logout-button" >Share</button>
      </Fragment>
      
    
  );
}

export default TrendingPeople;
