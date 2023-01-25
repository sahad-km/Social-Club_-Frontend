import React, { Fragment, useEffect, useState } from "react";
import UserPreview from "../Components/UserPreview/LeftSide/UserPreview";
import Center from "../Components/UserPreview/Center/Center";
import RightSide from "../Components/UserPreview/RigthSide/RightSide";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function UserPreviewPage() {
  const token = useSelector((state) => state.token.token);
  const [data, setData] = useState(null);
  let { id } = useParams();
  console.log("Idey...", id);
  useEffect(() => {
    fetch(`http://localhost:8000/dashboard/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": `${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setData(json.details);
        // const postCount = json.postCount;
        console.log("datahe...",json.details);
      });
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
