import React, { Fragment, useState, useEffect, useRef } from "react";
import SearchBar from "../Components/Home/SearchBar/SearchBar";
import { useSelector } from "react-redux";
import FriendSlip from "../Components/Chats/Friends/FriendSlip";
import ChatBox from "../Components/Chats/ChatBox/ChatBox";
import Peer from "simple-peer"
import {io} from 'socket.io-client'

function Chat() {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const socket = useRef();
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage,setSendMessage] = useState(null);
  const [receiveMessage,setReceiveMessage] = useState(null);
  const [chats,setChats] = useState([]);



  const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()




   //Get chats in the chat section
   useEffect(()=>{
    const getAllChats =async()=> {
      fetch(`http://localhost:8000/chat/${user._id}`, {
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
    }
    getAllChats();
  },[user._id]);

  //Connecting to the socket io
  useEffect(()=>{
    socket.current = io('ws://localhost:8008');
    console.log("low fps",user._id)
    socket.current.emit("new-user-add", user._id)
    socket.current.on("get-users", (users)=> {
      setOnlineUsers(users)
    })
  },[user])


  useEffect(() => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream)
        myVideo.current.srcObject = stream
      })
	    socket.current.on("me", (id) => {
			setMe(id)
      console.log("entho id",me)
		})

		socket.current.on("callUser", (data) => {
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})
	}, [])

  // Call a user
  const callUser = (id) => {
    console.log("Call vanno...")
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.current.emit("callUser", {
				userToCall: id,
				signalData: data,
				from: me,
				name: name
			})
		})
		peer.on("stream", (stream) => {
			
				userVideo.current.srcObject = stream
			
		})
		socket.current.on("callAccepted", (signal) => {
			setCallAccepted(true)
			peer.signal(signal)
		})

		connectionRef.current = peer
	}

  //Accepting call

  const answerCall =() =>  {
		setCallAccepted(true)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.current.emit("answerCall", { signal: data, to: caller })
		})
		peer.on("stream", (stream) => {
			userVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connectionRef.current = peer
	}


  //Sending messages to socket server
  useEffect(()=>{
    if(sendMessage!==null){
      console.log(sendMessage)
      socket.current.emit('send-message', sendMessage)
    }
  },[sendMessage])

  //Receiving message from socket server
  useEffect(()=>{
    socket.current.on("receive-message", (data) => {
      console.log("messageKitti",data)
      setReceiveMessage(data)
    })
  },[])

 
  //Check online or not 
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  console.log("engane shareef id",currentChat)
  return (
    <div className="row" style={{height:'100%'}}>

        <div className="video">
					{stream &&  <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />}
				</div>
				<div className="video">
					{callAccepted && myVideo && !callEnded ?
					<video playsInline ref={userVideo} autoPlay style={{ width: "300px"}} />:
					null}
				</div>

      <div className="col-md-3" style={{marginBottom:'3.4em'}} >
      <SearchBar />
      <div className="conversation">
        <h2 style={{margin:'10px',fontWeight:'bolder'}}>Chats</h2>
        <hr style={{ width:'85%', border: "0.2px solid black",marginBottom:'0'}} />
        {chats.map((chat,id) => {
        return (
        <div key={id} onClick={()=>{setCurrentChat(chat)}}>
        <FriendSlip data={chat} currentUser={user._id} online={checkOnlineStatus(chat)} />
        </div>
        )
        })}
      </div>
    </div>
      <ChatBox chat={currentChat} currentUser={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage} callUser={callUser} /> 
    
      <div>
				{receivingCall && !callAccepted ? (
						<div className="caller">
						<h1 >{name} is calling...</h1>
						<button variant="contained" color="primary" onClick={answerCall} >
							Answer
						</button>
					</div>
				) : null}
			</div>

    </div>
  );
}

export default Chat;
