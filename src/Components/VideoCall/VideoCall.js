import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FriendSlip from "../Chats/Friends/FriendSlip";
import { FiPhoneCall, FiPhoneOff } from "react-icons/fi";
import {Modal} from "react-bootstrap";
import { BsMicMute, BsMic, BsCameraVideo, BsCameraVideoOff,BsTelephoneInbound,BsTelephoneX } from "react-icons/bs";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import './VideoCall.css'
import { toast } from "react-toastify";

function Chat() {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const socket = useRef();
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [muted, setMuted] = useState(false);
  const [mutedVideo, setMutedVideo] = useState(false);
  const [me, setMe] = useState("");
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState("");
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [callingTo,setCallingTo] = useState(false);
  
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

  //Connecting to the socket io
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET);
    socket.current.emit("new-user-add", user._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(()=>{
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });
  }, [me])

  useEffect(() => {
    socket.current.on("me", (id) => {
      setMe(id);
    });

    socket.current.on("callUser", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });
  }, []);

  //Get chats in the chat section
  useEffect(() => {
    const getAllChats = async () => {
      fetch(`${process.env.REACT_APP_BACKEND}/chat/${user._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setChats(json.chat);
        });
    };
    getAllChats();
  }, [user._id]);

  // Call a user
  const callUser = (id) => {
    if(idToCall == ""){
      toast.warn('Select an User to call',toastConfig);
      return
    }
    setCallingTo(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name: user.userName,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.current.on("callAccepted", (signal) => {
      setCallingTo(false);
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  //Accepting call
  const answerCall = () => {
    setCallAccepted(true);
    setShowModal(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.current.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  //Mute option handling
  const handleMute = () => {
    setMuted(!muted);
    stream.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });
  };

  //Mute video option
  const handleMuteVideo = () => {
    setMutedVideo(!mutedVideo);
    if (stream) {
      const tracks = stream.getVideoTracks();
        tracks.forEach((track) => {
            track.enabled = !track.enabled;
        });
    }
  };

  //End call handler
  const leaveCall = () => {
    setCallEnded(true);
    setShowModal(false);
    connectionRef.current.destroy();
    socket.current.emit('end-call', idToCall)
    stream.getTracks().forEach((track) => track.stop());
    toast.info("Call Ended",toastConfig)
    navigate('/');
  };

  //Notifying Call ended
  useEffect(()=>{
    socket.current.on("call-ended", () => {
      setCallEnded(true);
      navigate('/');
      connectionRef.current.destroy();
      stream.getTracks().forEach((track) => track.stop());
      toast.info("Call Ended",toastConfig)
    })
  },[])

  //Check online or not
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  //Call notifier
  useEffect(()=>{
    if(receivingCall && !callAccepted){
      setShowModal(true)
    }
  })

  return (
    <>
    <div className="row row-container" style={{ minHeight: "75vh" }}>
      <div className="col-md-6 video-div">
        {stream && (
          <video
          className="videoContainer"
            playsInline
            muted
            ref={myVideo}
            autoPlay
          />
        )}
      </div>
      <div className="col-md-6 video-div">
        {callAccepted && !callEnded ? (
          <video
          className="videoContainer"
            playsInline
            ref={userVideo}
            autoPlay
          />
        ) : <div
        style={{
          padding: "10px",
          width: "400px",
          borderRadius: "0.7em",
          backgroundColor: "white",
          marginLeft: "2em",
        }}
      >
        <h2>Your Friends</h2>
        <hr></hr>
        {chats.map((chat, id) => {
          return (
            <div
              className={chat.members.includes(idToCall) ? "selected" : ""}
              key={id}
              onClick={() => {
                const otherMember = chat.members.filter(member => member !== user._id);
                setIdToCall(otherMember[0]);
              }}
            >
              <FriendSlip
                data={chat}
                currentUser={user._id}
                online={checkOnlineStatus(chat)}
              />
            </div>
          );
        })}
      </div>}
      </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
        <p style={{margin:'20px'}}>{name} is calling...</p>
        <div className="caller">
            <button className="call-noti-btn" style={{backgroundColor:'green'}} variant="contained" color="primary" onClick={answerCall}>
              <BsTelephoneInbound/>
            </button>
            <button className="call-noti-btn" style={{backgroundColor:'red'}} variant="contained" color="primary" onClick={leaveCall}>
              <BsTelephoneX/>
            </button>
          </div>
        </Modal>
    </div>
    {callingTo && <p style={{fontSize:'20px'}} className="text-center">Calling...</p>}
    <div className="row row-container" style={{ minHeight: "25vh" }}>
    {callAccepted && !callEnded ? (
      <>
      <button className="mute-btn" onClick={handleMuteVideo}>
      {mutedVideo ? <BsCameraVideo/> : <BsCameraVideoOff/>}
      </button>
      <button
        className="end-btn"
        variant="contained"
        color="secondary"
        onClick={leaveCall}
      >
        <FiPhoneOff fontSize="40px" />
      </button>
      <button className="mute-btn" onClick={handleMute}>{muted ? <BsMic/> : <BsMicMute/>}</button>
      </>
    ) : (
      <button
        disabled={callingTo}
        className="call-btn"
        color="primary"
        aria-label="call"
        onClick={() => callUser(idToCall)}>
        <FiPhoneCall fontSize="40px" />
      </button>
    )}
  </div>
 </>
  );
}

export default Chat;
