import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Loader from "../../../Loader/Loader";
import Post from "../Post";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTimelinePosts } from "../../../../redux/actions/postAction";
import "./Posts.css";

const Posts = () => {
  const dispatch = useDispatch();
  let posts = useSelector(state => state.post.post);
  const params = useParams()
  const [loading, setLoading] = useState(false);

   //Fetching post data from database
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const id = decodedToken.userId;
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND}/post/timeline_posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(setTimelinePosts(data));
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <Loader />;
  if (!posts) return <p className="text-center" style={{marginTop:'2em',}}>You did'nt post anything</p>;
  if(params.id) posts = posts.filter((post)=> post.userId===params.id)
  return (
    <div className="Posts">
      {posts.map((post,id) => {
        return <Post data={post} key={id} />;
      })}
    </div>
  );
};

export default Posts;
