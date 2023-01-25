import React, { Fragment, useEffect } from "react";
import ProfileCard from "../Components/Home/LeftSide/Profile/ProfileCard";
import RightSide from "../Components/Home/RightSide/RightSide";
import CenterHome from "./CenterHome";
function Home() {
  return (
      <div className="row">
      <ProfileCard/>
      <CenterHome/>
      <RightSide/> 
      </div>
  );
}

export default Home;
