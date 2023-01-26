import React, { useState, useEffect } from "react";
import RigthModal from "../Home/PostSide/CommentModal/RigthModal";
import { useSelector } from "react-redux";
import {AiOutlineHeart,AiFillHeart,AiOutlineSend} from "react-icons/ai";
import { RWebShare } from "react-web-share";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { BiShare} from "react-icons/bi";
import './SinglePost.css'

function SinglePost() {
  const params = useParams();
  const id = params.id;
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [comments,setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [details, setDetails] = useState("");
  const [liked, setLiked] = useState( data ? data.liked.includes(user._id) : false);
  const [likes, setLikes] = useState(data ? data.liked.length : 0);

  //Fetching post data 
  useEffect(()=>{
    console.log("anything happen")
    fetch(`http://localhost:8000/post/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": `${token}`,
        }
    })
    .then((response) => response.json())
    .then((json) => {
        console.log("respo",json);
        if(json.err){
            navigate('/login');
        }else{
            setData(json.post[0]);
            console.log("haymma hayamma",data)
        }
    })
  },[id])

  //Fetching user Details
  useEffect(() => {
    fetch(`http://localhost:8000/dashboard/${data && data.userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": `${token}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setDetails(json.details);
      });
  }, [data]);

  //Fetching all comment of this post
  useEffect(()=> {
    fetch(`http://localhost:8000/post/comments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        }
      })
        .then((response) => response.json())
        .then((json) => {
        setComments(json.comments)
      });
  },[comment])

  const Submit = () => {
    fetch(`http://localhost:8000/post/add_comment/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": `${token}`,
      },
      body: JSON.stringify({
        userId: user._id,
        comment:comment
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        setComment("");
      });
  };

  //Functionalities of  Like button
  const handleLike = (e, postId) => {
    e.preventDefault();
    if (data && user) {
      fetch(`http://localhost:8000/post/like_unlike/${postId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setLiked((prev) => !prev);
          liked ? setLikes((prev) => prev - 1) : setLikes((prev) => prev + 1);
        });
    }
  };

  return (
    <>
      <div className="col-md-6 leftSide">
        <div
          className={`Post ${isDarkMode ? "dark-mode-inner" : "light-mode-inner"}`}>
          { data && data.postType === "video" ? (
            <video
              style={{ borderRadius: "0.7em" }}
              src={data && data.image}
              controls
            ></video>
          ) : (
            <img
              style={{ userSelect: "none" }}
              src={data && data.image}
              alt=""
            />
          )}
          <div className="postReact">
            {liked ? (
              <AiFillHeart
                onClick={(e) => {
                  handleLike(e, data._id);
                }}
                style={{ color: "red" }}
              />
            ) : (
              <AiOutlineHeart
                onClick={(e) => {
                  handleLike(e, data._id);
                }}
              />
            )}
            {/* <Link to={`/${data._id}`}> */}
            <RWebShare
              data={{
                text: "Share the post",
                url: `https://foodiefrontier.onrender.com/SinglePost/`,
                title: "Share Post",
              }}
              onClick={() => console.log("shared successfully!")}
            >
              <BiShare />
            </RWebShare>
          </div>

          <span style={{ color: "var(--gray)", fontSize: "12px" }}>
            {likes} likes
          </span>

          <div className="detail">
            <span>
              <Link
                style={{
                  textDecoration: "none",
                  color: isDarkMode ? "white" : "#1a1919",
                  marginRight: "1em",
                }}
                to={`/user/${data && data.userId}`}
              >
                <b>{details && details.userName}</b>
              </Link>
            </span>
            <span style={{ fontSize: "15px" }}>{data && data.caption}</span>
          </div>
        </div>
      </div>
      <div className="col-md-6 rightSide">
        <div className="">
          <div className="row">
            <h4>Comments</h4>
            <div
              className="col-md-12 mainDiv"
              style={{
                position: "relative",
                overflow: "auto",
                maxHeight: "40vh",
              }}
            >
              {comments.length > 0 ? (
                comments.map((comment, id) => {
                  return <RigthModal data={comment} key={id} />;
                })
              ) : (
                <p className="text-center">No Comments to Show..</p>
              )}
            </div>
            <div
              style={{
                margin: "10px",
                display: "flex",
                position: "absolute",
                bottom: "0",
                width: "93%",
              }}
            >
              <input
              className="comment_input"
                onChange={(e) => {
                  setComment(e.target.value);
                }}
                value={comment}
                placeholder="Enter your Comments..."
              />
              <AiOutlineSend
                onClick={(e) => {
                  Submit(e);
                }}
                style={{ margin: "auto", marginLeft: "1em", fontSize: "1em" }}
              />
            </div>
          </div>
          </div>
      </div>
    </>
  );
}

export default SinglePost;
