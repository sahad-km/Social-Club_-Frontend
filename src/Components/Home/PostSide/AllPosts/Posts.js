import React, { useEffect, useState } from "react";
import Loader from "../../../Loader/Loader";
import Post from "../Post";
import { useParams,useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setTimelinePosts } from "../../../../redux/actions/postAction";
import "./Posts.css";

const Posts = () => {
  const dispatch = useDispatch();
  let posts = useSelector(state => state.post.post);
  const token = useSelector((state) => state.token.token);
  const { user } = useSelector((state) => state.user);
  const params = useParams()
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Fetching post data from database
  useEffect(() => {
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND}/post/timeline_posts/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch(setTimelinePosts(data));
          setLoading(false);
        });
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
