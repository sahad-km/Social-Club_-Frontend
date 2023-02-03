import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Components/Home/SearchBar/SearchBar";
import { useSelector } from "react-redux";
import FriendSlip from "../Components/Chats/Friends/FriendSlip";
import ChatBox from "../Components/Chats/ChatBox/ChatBox";
import {io} from 'socket.io-client'

function Chat() {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const navigate = useNavigate();
  const socket = useRef();
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sendMessage,setSendMessage] = useState(null);
  const [receiveMessage,setReceiveMessage] = useState(null);
  const [chats,setChats] = useState([]);

  //Check user logout or not
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  },[token])

   //Get chats in the chat section
   useEffect(()=>{
    const getAllChats =async()=> {
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
    }
    getAllChats();
  },[user._id]);

  //Connecting to the socket io
  useEffect(()=>{
    socket.current = io(process.env.REACT_APP_SOCKET);
    socket.current.emit("new-user-add", user._id)
    socket.current.on("get-users", (users)=> {
      setOnlineUsers(users)
    })
  },[user])

  //Sending messages to socket server
  useEffect(()=>{
    if(sendMessage!==null){
      socket.current.emit('send-message', sendMessage)
    }
  },[sendMessage])

  //Receiving message from socket server
  useEffect(()=>{
    socket.current.on("receive-message", (data) => {
      setReceiveMessage(data)
    })
  },[])

 
  //Check online or not 
  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member) => member !== user._id);
    const online = onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };
  
  return (
    <div className="row" style={{height:'100%'}}>
      <div className="col-md-3" style={{marginBottom:'3.4em'}} >
      <SearchBar />
      <div className={`conversation ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
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
      <ChatBox chat={currentChat} currentUser={user._id} setSendMessage={setSendMessage} receiveMessage={receiveMessage}/>
    </div>
  );
}

export default Chat;
