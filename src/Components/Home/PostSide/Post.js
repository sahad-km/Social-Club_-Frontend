import React, { useState, useEffect } from "react";
import Logo from "../../../Social Club Logo.png";
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from "react-redux";
import { AiOutlineHeart,AiOutlineDelete,AiFillHeart,AiOutlineClose,AiOutlineEdit } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { BiShare,BiComment } from "react-icons/bi";
import CommentModal from "./CommentModal/CommentModal";
import { deletePost,editPost,setComment } from "../../../redux/actions/postAction";
import "./Post.css";

function Post({ data }) {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const dispatch = useDispatch();
  const params = useParams()
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [caption,setCaption] = useState(data ? data.caption : '')
  const [liked, setLiked] = useState(
    data ? data.liked.includes(user._id) : false
  );
  const [likes, setLikes] = useState(data ? data.liked.length : false);

  //Fetching user Details
  useEffect(() => {
    fetch(`http://localhost:8000/dashboard/${data.userId}`, {
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
  }, []);

  //Get all Comments
  const loadComments = (id) => {
    console.log("HI dadadadaddadadad")
    fetch(`http://localhost:8000/post/comments/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        }
      })
        .then((response) => response.json())
        .then((json) => {
        console.log("jsoneyy...",json.comments)
        // setComments(json.comments)
        dispatch(setComment(json.comments))
        // console.log("Hehehehe..",post)
      });
  }

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

  //Delete a post
  const deletingPost =(id) => {
    fetch( `http://localhost:8000/post/delete/${id}`, {
      method:"DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": `${token}`,
      }
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("deleted")
      dispatch(deletePost(id))
      setShowModal(false)
    })
  }

  //Editing Post 
  const editingPost =(id)=>{
    fetch(`http://localhost:8000/post/update_post/${id}`,{
      method:"PUT",
      headers: {"Content-Type": "application/json","X-Custom-Header": `${token}`,},
      body: JSON.stringify({
        caption: caption,
      })
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("Changes Saved...")
      dispatch(editPost({id,caption}))
      setEditModal(false)
    })
  }

  return (
    <div className={`Post ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
      { data.postType === "video" ? <video style={{borderRadius:'0.7em'}} src={data && data.image} controls ></video> :
       <img style={{ userSelect: "none" }} src={data && data.image} alt="" /> }
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
        <BiComment
          onClick={(e) => {
            e.preventDefault();
            console.log("chu chu chu",data._id)
            loadComments(data._id)
            setIsOpen(true);
          }}
        />
        {/* </Link> */}
        <CommentModal id={data._id} open={isOpen} onClose={() => setIsOpen(false)} />
        <BiShare />
        { params.id && user._id === data.userId ? <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}} >
        <AiOutlineEdit onClick={() => setEditModal(true)} style={{marginLeft:'auto',cursor:'pointer'}} /> 
        <AiOutlineDelete onClick={() => setShowModal(true)} style={{marginLeft:'1em',cursor:'pointer'}} />
        </div>:'' }
      </div>
      
      <Modal show={showModal} onHide={() => setShowModal(false)}>
      <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}} >
      <AiOutlineClose style={{marginLeft:'auto',cursor:'pointer',margin:'10px'}} onClick={() => setShowModal(false)}/>
        </div>
          <p style={{color:'red',padding:'0.5em'}} >Are you sure to want delete this post?</p>
          <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}}>
          <button style={{marginLeft:'auto',cursor:'pointer',margin:'10px',width:'80px',height:'30px'}} onClick={()=>{setShowModal(false)}} className="button" >Cancel</button>
          <button style={{cursor:'pointer',margin:'10px',width:'80px',height:'30px'}} className="button" onClick={()=>{deletingPost(data._id)}} >Delete</button>
          </div>
      </Modal>

      <Modal show={editModal} onHide={() => setEditModal(false)}>
      <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}} >
      <AiOutlineClose style={{marginLeft:'auto',cursor:'pointer',margin:'10px'}} onClick={() => setEditModal(false)}/>
        </div>
          <input style={{width:'90%',marginLeft:'20px'}} type="text" class="infoInput" onChange={(e)=>{setCaption(e.target.value)}} value={caption}/>
          <div style={{display:'flex',justifyContent:'flex-end',width:'100%'}}>
          <button style={{marginLeft:'auto',cursor:'pointer',margin:'10px',width:'80px',height:'30px'}} onClick={() => setEditModal(false)} className="button" >Cancel</button>
          <button style={{cursor:'pointer',margin:'10px',width:'80px',height:'30px'}} className="button" onClick={()=>{editingPost(data._id)}} >Save</button>
          </div>
      </Modal>

      <span style={{ color: "var(--gray)", fontSize: "12px" }}>
        {likes} likes
      </span>
      
      <div className="detail">
        <span>
          <Link style={{textDecoration: "none", color:isDarkMode ? "white" : "#1a1919", marginRight: "1em",}} to={`/user/${data.userId}`}>
            <b>{data && details.userName}</b>
          </Link>
        </span>
        <span style={{fontSize:'15px'}}>{data && data.caption}</span>
      </div>
    </div>
  );
}

export default Post;
