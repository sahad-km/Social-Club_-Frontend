import React from 'react'
import { useNavigate } from 'react-router-dom';

const Register_style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    width: "40%",
    transform: "translate(-50%,-50%)",
    backgroundColor: "#FFF",
    padding: "20px",
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


function CallModal({ open, onClose, id, name, receivingCall, callAccepted }) {
    const navigate = useNavigate();
    if (!open) return null;
    return (
      <>
        <div style={overlay_style} />
        <div style={Register_style}>
        <div>
        {receivingCall && !callAccepted ? (
          <div className="caller">
            <h1>{name} is calling...</h1>
            <button variant="contained" color="primary" onClick={()=>{navigate('/chat')}}>
              End Call
            </button>
            <button variant="contained" color="primary" onClick={()=>{navigate(`/video_call/${id}`)}}>
              Answer Call
            </button>
          </div>
        ) : null}
      </div>
           
        </div>
      </>
    );
}

export default CallModal