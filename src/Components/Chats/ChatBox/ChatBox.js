import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import "./ChatBox.css";
import altProfile from "../../../Img/man-157699.png";
import { GrSend } from "react-icons/gr";
import InputEmoji from "react-input-emoji";
import { BsCameraVideoFill} from "react-icons/bs";
import { BiVideoPlus,BiImageAdd } from "react-icons/bi";
import { MdAttachFile} from "react-icons/md";
import { format } from "timeago.js";
import Menu from "../../Home/Menus/Menu";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import DotSpinner from "../../DotSpinner/DotSpinner";
import { toast } from "react-toastify";
import { logout } from "../../../redux/actions/userAction";

const toastConfig = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

function ChatBox({chat,currentUser,setSendMessage,receiveMessage,callUser}) {
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const token = useSelector((state) => state.token.token);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [image, setImage] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const imageRef = useRef();
  const videoRef = useRef();
  const scroll = useRef();
  const recorderControls = useAudioRecorder();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  //Handle voice messages
  const addAudioElement = (blob) => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("file", blob);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_UPLOAD_NAME);
      fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_UPLOAD_NAME}/video/upload`, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          const message = {
            senderId: currentUser,
            text: data.url,
            chatId: chat._id,
            type: "voice",
          };
          //Sending voice message to socket server
          const receiverId = chat.members.find((id) => id !== currentUser);
          setSendMessage({ ...message, receiverId });
          //Sending to the database
          fetch(`${process.env.REACT_APP_BACKEND}/chat/add_message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Custom-Header": `${token}`,
            },
            body: JSON.stringify({
              senderId: currentUser,
              text: data.url,
              chatId: chat._id,
              type: "voice",
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              setMessages([...messages, json.result]);
              setLoading(false);
            });
        });
    } catch (err) {
      toast.error("Voice can't send, Try again later", toastConfig)
    }
  };

  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // Get user data on chat header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        fetch(`${process.env.REACT_APP_BACKEND}/dashboard/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": `${token}`,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            setUserData(json.details);
          });
      } catch (error) {
        toast.error("Problem with server", toastConfig)
      }
    };
    if (chat !== null) getUserData();
  }, [chat, currentUser]);

  // Getting messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        fetch(`${process.env.REACT_APP_BACKEND}/chat/message/${chat._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Custom-Header": `${token}`,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            setMessages(json.result);
          });
      } catch (error) {
        console.log(error);
      }
    };

    if (chat !== null) fetchMessages();
  }, [chat]);

  //Sending Media through messages
  const UploadFile = async () => {
    if(videoFile === null && image === null){
      return;
    }
    setLoading(true);
    const type = !image ? "video" : "image";
    const file = !image ? videoFile : image;
    if(file.size > 7000000){
      toast.info("🥵 Seems like big a file, take some time", toastConfig)
    }
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_UPLOAD_NAME}/${type}/upload`;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_UPLOAD_NAME);
    try {
        const res = await fetch(cloudinaryUrl, {
            method: "post",
            body: data,
        });
        const json = await res.json();
        const url = json.url;
        const message = {
          senderId: currentUser,
          text: url,
          chatId: chat._id,
          type: type,
        };
        //Sending file to socket server
        const receiverId = chat.members.find((id) => id !== currentUser);
        setSendMessage({ ...message, receiverId });
        //Sending to the database
          fetch(`${process.env.REACT_APP_BACKEND}/chat/add_message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Custom-Header": `${token}`,
            },
            body: JSON.stringify({
              senderId: currentUser,
              text: url,
              chatId: chat._id,
              type: type,
            }),
          })
            .then((response) => response.json())
            .then((json) => {
              setMessages([...messages, json.result]);
              setLoading(false)
              setVideoFile(null);
              setImage(null);
            });
    } catch (err) {
        toast.error("Oops, uploading failed", toastConfig);
    }
};

  // Sending the message to the backend
  const sendMessage = (e) => {
    if(newMessage.trim() === ''){
      return;
    }
    if (!localStorage.getItem('token')) {
      dispatch(logout())
    }
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
      type: "text",
    };

    //Sending to the socket server
    const receiverId = chat.members.find((id) => id !== currentUser);
    setSendMessage({ ...message, receiverId });

    //Sending to the database
    try {
      fetch(`${process.env.REACT_APP_BACKEND}/chat/add_message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
        body: JSON.stringify({
          senderId: currentUser,
          text: newMessage,
          chatId: chat._id,
          type: "text",
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          setMessages([...messages, json.result]);
          setNewMessage("");
        });
    } catch (err) {
      console.log(err);
    }
  };

  //Receive message from server
  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  // Always scroll to last Message
  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Call a User
  const callFriend = () => {
    const id = chat.members.find((id) => id !== currentUser);
    callUser(id);
  };

  return (
    <div className="col-md-9">
      <div className="row" style={{marginBottom:'2em'}} >
        <div className="col-md-7"></div>
        <div className="col-md-5">
          <Menu />
        </div>
      </div>
      <div className={`ChatBox-container ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
        {chat ? (
          <>
            <div className="chat-header">
              <div className="follower">
                <div>
                  {userData?.profilePicture ? (
                    <img
                      src={userData.profilePicture}
                      alt="Profile"
                      className="followerImage"
                      style={{ width: "50px", height: "50px" }}
                    />
                  ) : (
                    <img
                      src={altProfile}
                      alt="Profile"
                      className="followerImage"
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}

                  <div className="name" style={{ fontSize: "0.9rem" }}>
                    <span>{userData && userData.userName}</span>
                  </div>
                  <div></div>
                </div>
                <BsCameraVideoFill
                  className="videoCall_icon"
                  onClick={callFriend}
                />
              </div>
              <hr
                style={{
                  width: "95%",
                  border: "0.1px solid #ececec",
                  marginTop: "10px",
                }}
              />
            </div>
            <div className="chat-body">
              {messages.map((message, id) => (
                <>
                  <div ref={scroll} key={id} className={message.senderId === currentUser ? "own" : "message"}>
                  {message.type ==="text" && <span>{message.text ? message.text : ""}</span>}
                  {message.type ==="voice" && <audio src={message.text} controls></audio>}
                  {message.type ==="image" && <img src={message.text}></img>}
                  {message.type ==="video" && <video src={message.text} controls></video>}
                    <span className="date" >{format(message.createdAt)}</span>
                    
                  </div>
                </>
              ))}
            </div>
            <div className="chat-sender">
              <div style={{position:'relative'}} onClick={()=>{setShowMenu(!showMenu);}}>
                <MdAttachFile />
              </div>
              {showMenu && (
              <div style={{ display: "block",textAlign:'center',height:'max-content', position:'absolute',marginTop:'-7em',marginLeft:'-0.7em'}}>
                <div onClick={() => imageRef.current.click()} style={{backgroundColor:isDarkMode? 'white' : '#1a1919',padding:'5px',borderRadius:'50%',marginBottom:'0.7em'}}>
                  <BiImageAdd style={{fontSize:'2em',color:'#21F052'}} />
                  <input disabled={videoFile} onChange={(e) => {setImage(e.target.files[0])}} type="file" id="file" ref={imageRef} style={{ display: "none" }} accept="image/x-png,image/gif,image/jpeg"/>
                </div>
                <div onClick={() => videoRef.current.click()} style={{backgroundColor:isDarkMode? 'white' : '#1a1919',padding:'5px',borderRadius:'50%',marginBottom:'0.7em'}}>
                  <BiVideoPlus style={{fontSize:'2em',color:'#EC4768'}}/>
                  <input disabled={image} onChange={(e)=>{setVideoFile(e.target.files[0])}} type="file" id="file" ref={videoRef} style={{ display: "none" }} accept="video/mp4,video/x-m4v,video/*"/>
                </div>
              </div>
              )}
              
              <InputEmoji value={newMessage} onChange={handleChange} />

              <AudioRecorder
                onRecordingComplete={(blob) => addAudioElement(blob)}
                recorderControls={recorderControls}
              />

             {loading ? <DotSpinner/> : <GrSend style={{marginLeft:'1em'}} onClick={() => newMessage !== '' ? sendMessage() : UploadFile() } className="sendIcon"/> }
              <input
                type="file"
                name=""
                id=""
                style={{ display: "none" }}
                ref={imageRef}
              />
            </div>
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a friend to start conversation...
          </span>
        )}
      </div>
    </div>
  );
}

export default ChatBox;
