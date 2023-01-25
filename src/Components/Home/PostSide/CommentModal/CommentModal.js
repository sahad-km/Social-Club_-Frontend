import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineSend } from "react-icons/ai";
import RigthModal from "./RigthModal";
import './RightModal.css'
import { addComment } from "../../../../redux/actions/postAction";


function CommentModal({ id, open, onClose }) {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [comments,setComments] = useState([]);
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  
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

  const style = {
    width: "100%",
    backgroundColor: "#DCDCDC",
    borderRadius: "10px",
    padding: "6px",
    fontSize: "17px",
    border: "none",
    outine: "none",
    display: "flex",
  };

  const Register_style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "40%",
    height: "60%",
    transform: "translate(-50%,-50%)",
    backgroundColor: isDarkMode ? "#1a1919" : "#FFF",
    padding: "10px",
    zIndex: 1000,
    borderRadius: "0.7em",
  };
  
  const overlay_style = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgb( 0, 0, 0, .7 )",
    zIndex: 1000,
  };

  if (!open) return null;
  return (
    <>
      <div style={overlay_style} />
      <div style={Register_style}>
        <AiOutlineClose className="float-right" onClick={onClose} />
        <div className="row">
          <h4>Comments</h4>
          <div className="col-md-12 mainDiv" style={{ position: "relative",overflow:'auto',maxHeight:'40vh'}}>
            { comments.length>0 ? comments.map((comment, id) => {
              return <RigthModal data={comment} key={id} />;
            }) : <p className="text-center">No Comments to Show..</p>}
          </div>
          <div
            style={{
              margin:'10px',
              display: "flex",
              position: "absolute",
              bottom: "0",
              width: "93%",
            }}
          >
            <input
              onChange={(e) => {
                setComment(e.target.value);
              }}
              value={comment}
              style={style}
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
    </>
  );
}

export default CommentModal;
