import React, { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from '../Loader/Loader'
import Logo from "../../Social Club Logo.png";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [visible,setVisible] = useState(false);
  const [loading,setLoading] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const [minutes, setMinutes] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          setVisible(true)
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  },[seconds, minutes]);


  async function registerUser(e) {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("http://localhost:8000/register/verifyotp", {
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
      console.log("OK all");
      const response = await fetch("http://localhost:8000/register/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
        }),
      });
      const data = await response.json();
      setLoading(false);
      if (data.status === "ok") {
        navigate("/login");
      } else if (data.status === "fail") {
        alert("You are failed to register! Try with another Email");
      }
    } else if (data.status === "fail") {
      alert("You are failed to register! Try with another Email");
    }
  }
  async function verifyAccount(e) {
    e.preventDefault();
    if (
      email.trim() === "" ||
      userName.trim() === "" ||
      password.trim() === ""
    ) {
      alert("Please provide details first");
      return;
    }
    if (password !== repassword) {
      alert("Entered passwords are mismatched");
      return;
    }
    setLoading(true)
    const response = await fetch("http://localhost:8000/register/otpsend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });
    const data = await response.json();
    setLoading(false);
    if (data.status === "sended") {
      setIsActive(true);
      setMinutes(1);
      setSeconds(30);
    }else{
      alert("Try with another Email")
    }
  }

  // function resendOtp() {
  //   fetch("http://localhost:8000/register/otpsend", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //        "X-Custom-Header": `${token}`,
  //     },
  //     body: JSON.stringify({
  //       email,
  //     }),
  //   }).then((res) => res.json())
  //   .then(data => {
  //       if(data.status === 'sended') {
  //           setMinutes(1);
  //           setSeconds(30);
  //       }
  //   })
  // }
  // setInterval(updateCount, 1000);

if(loading) return <Loader/>
  return (
    <div className="row Auth">
      {/* left side */}

      <div className="col-md-6 a-left">
        <img src={Logo} alt="" />

        <div className="Webname">
          <h1>Social Club</h1>
          <h6>Explore the world with your fingertip</h6>
        </div>
      </div>

      {/* right form side */}
      { loading ? <Loader/> : 
      <div className="col-md-5 a-right">
        <form style={{ display: isActive ? "none" : "block" }}>
          <h4 className="text-center">{isActive ? "Enter OTP" : "Signup"}</h4>
          <div class="form-group">
            <input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              class="form-control"
              name="userName"
              value={userName}
              aria-describedby="emailHelp"
              placeholder="Username"
            ></input>
          </div>
          <div class="form-group">
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              class="form-control"
              name="email"
              value={email}
              aria-describedby="emailHelp"
              placeholder="Email"
            ></input>
          </div>
          <div class="form-group">
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              class="form-control"
              value={password}
              name="password"
              placeholder="Password"
            ></input>
          </div>
          <div class="form-group">
            <input
              onChange={(e) => setRepassword(e.target.value)}
              type="password"
              class="form-control"
              value={repassword}
              name="repassword"
              placeholder="Re-Enter Password"
            ></input>
          </div>
          <button onClick={verifyAccount} type="submit" className="button logout-button">
            SignUp
          </button>
          <Link to="/login" className="mt-2 linkword">Already an user? Login</Link>
        </form>
        <div style={{ display: isActive ? "block" : "none"}}>
          <input
            className="form-control"
            type="password"
            value={otp}
            name="otp"
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          ></input>
          { visible ? <p className="text-center linkword" onClick={verifyAccount} style={{fontSize:'15px',marginTop:'10px',cursor:'pointer'}} >Resend OTP</p> : <p className="text-center" style={{fontSize:'15px',marginTop:'10px'}}>Resend Code in  {minutes} : {seconds} Minutes</p> }
          <button

            onClick={registerUser}
            type="submit"
            className="button logout-button">
            Confirm
          </button>
        </div>
      </div>
      }
    </div>
  );
}

export default Signup;
