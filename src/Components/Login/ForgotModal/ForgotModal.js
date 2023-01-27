import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";

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

function ForgotModal({ open, onClose }) {
  const navigate = useNavigate("");
  const [hide,setHide] = useState(false)
  const [isActive, setIsActive] = useState(false);
  const [email,setEmail] = useState(null);
  const [otp,setOtp] = useState(null);
  const [password,setPassword] = useState(null);

  async function forgotPassword(e) {
    e.preventDefault();
    if(email.trim() === ""){
        alert("Please provide Email first");
        return
    }
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/register/forgot/otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await response.json();
    if (data.status === "sended") {
      setIsActive(true);
    }else{
      alert("Try with another Email")
    }
  }

  async function verifyOtp(e) {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/register/forgot/otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    });
    const data = await response.json();
    if (data.status === "success") {
      setHide(true)
     
    } else if (data.status === "fail") {
      alert("You are failed to register! Try with another Email");
    }
  }

  if (!open) return null;
  return (
    <>
      <div style={overlay_style} />
      <div style={Register_style}>
        <AiOutlineClose className="float-right" onClick={onClose} />
        <h5>Forgot Password</h5>
        <p>Reset password by verifying your Email</p>
        <form>
          <div class="form-row infoForm" style={{display: hide ? "none" : "block"}}>
            <div style={{ display: isActive ? "none" : "block" }} class="form-group col-md-12">
              <input
              onChange={(e)=>{setEmail(e.target.value)}}
                type="email"
                class="infoInput"
                id="inputEmail4"
                placeholder="Enter Email"
              ></input>
            </div>
            <div style={{ display: isActive ? "block" : "none" }} class="form-group col-md-12">
              <input
              onChange={(e)=>{setOtp(e.target.value)}}
                type="text"
                class="infoInput"
                id="inputPassword4"
                placeholder="Enter the OTP"
              ></input>
            </div>
          </div>
         
          <div style={{ display: hide ? "block" : "none" }} class="form-group col-md-12">
              <input
              onChange={(e)=>{setPassword(e.target.value)}}
                type="email"
                class="infoInput"
                id="inputEmail4"
                placeholder="Enter New Password"
              ></input>
              <button className="button logout-button">Set Password</button>
            </div>
          
          { isActive ? <button onClick={verifyOtp} className="button logout-button">Confirm</button> : <button onClick={forgotPassword} className="button logout-button">Send OTP</button>}
        </form>
      </div>
    </>
  );
}

export default ForgotModal;
