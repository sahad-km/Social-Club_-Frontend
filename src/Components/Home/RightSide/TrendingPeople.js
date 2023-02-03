import React, { Fragment, useEffect, useState } from "react";
import jwtDecode from 'jwt-decode';
import { useDispatch, useSelector } from "react-redux";
import "./TrendingPeople.css";
import { setUser } from "../../../redux/actions/userAction";

function TrendingPeople() {
  const dispatch = useDispatch();
  
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
