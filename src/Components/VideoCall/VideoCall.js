import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import './VideoCall.css'
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client'
import Peer from "simple-peer"

function VideoCall() {
	let { id } = useParams();
	const user = useSelector((state) => state.user.user);
	const [ me, setMe ] = useState("")
	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const socket = useRef();
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

	useEffect(() => {
		socket.current = io('ws://localhost:8008');
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
				myVideo.current.srcObject = stream
		})

		socket.current.on("me", (id) => {
			setMe(id)
		})

		socket.current.on("callUser", (data) => {
			console.log("call vannoda monuse..")
			setReceivingCall(true)
			setCaller(data.from)
			setName(data.name)
			setCallerSignal(data.signal)
		})

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

	}, [])

	// Call a user
	const callUser = (id) => {
		console.log("Call vanno...");
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
			name: user._id,
		  });
		});
		peer.on("stream", (stream) => {
		  userVideo.current.srcObject = stream;
		});
		socket.current.on("callAccepted", (signal) => {
		  setCallAccepted(true);
		  peer.signal(signal);
		});
		connectionRef.current = peer;
	  };

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

	const leaveCall = () => {
		setCallEnded(true)
		connectionRef.current.destroy()
	}


  return (
	<div className='row' style={{alignItems:'center',justifyContent:'center',minHeight:'100vh'}}>
		<div className='col-md-4' >
		<h1>User video</h1> <video  playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
        
		</div>
		<div className='col-md-4' >
		{callAccepted && !callEnded && userVideo.current !== null && connectionRef.current && connectionRef.current.open ? ( <>
            <h1>Opponent user </h1>
            <video muted playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
          </>
        ) : <button className='callbtn' onClick={()=>{callUser(id)}} >Start Call</button>}
		</div>
	</div>
  )
}

export default VideoCall