import React, { Fragment } from "react";
import DetailCard from "../Components/Profile/DetailCard/DetailCard";
import ProfileCard from "../Components/Profile/CenterDiv/ProfileCard";
import RightSide from "../Components/Home/RightSide/RightSide";

function Profile() {
  return (
    <Fragment>
      <div className="row">
        <DetailCard />
        <ProfileCard/>
        <RightSide/>
      </div>
    </Fragment>
  );
}

export default Profile;
