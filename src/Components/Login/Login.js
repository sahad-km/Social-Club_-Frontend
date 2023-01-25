import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import Logo from '../../Social Club Logo.png'
import ForgotModal from './ForgotModal/ForgotModal';
import { setToken, setUser} from '../../redux/actions/userAction';
import './Login.css'

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen,setIsOpen] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function loginUser(e) {
    e.preventDefault();
    if(email.trim() === ""){
        alert("Please provide Email first");
        return
    }
    if(password.trim() === ""){
        alert("Enter password");
        return;
    }
    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });
    const data = await response.json();
    if(data.user){
      localStorage.setItem('token',data.user);
      dispatch(setToken(data.user));
      console.log(data.details)
      dispatch(setUser(data.details));
      navigate('/');
  }
  }

  async function forgotPassword(e){
    e.preventDefault();
    setIsOpen(true);
  }

  return (
    <div className="row" style={{ height: '100vh' }}>

      {/* left side */}

      <div className="col-md-6 a-left">
        <img src={Logo} alt="" />

        <div className="Webname">
          <h1 >Social Club</h1>
          <h6>Explore the world with your fingertip</h6>
        </div>
      </div>

      {/* right form side */}

      <div className="col-md-6 p-5 a-right">
      <form className="authForm">
        <h4 className='text-center' >Login</h4>
  <div class="form-group">
    <input onChange={(e) => setEmail(e.target.value)} type="email" className="form-control" name="email" value={email} aria-describedby="emailHelp" placeholder="Email"></input>
  </div>
  <div className="form-group">
    <input onChange={(e) => setPassword(e.target.value)} type="password" className="form-control" name="password" value={password} placeholder="Password"></input>
  </div>
  <p onClick={forgotPassword} className='forgotPass'>Forgotten Password?</p>
  <div className='d-flex justify-content-center'>
  <button style={{width:'200px'}} onClick={loginUser}  className="button logout-button">Login</button>
  </div>
</form>
<ForgotModal open={isOpen} onClose={()=> setIsOpen(false)} />
<Link to="/signup" className='linkword'>New User? Create New Account</Link>
      </div>
    </div>
  )
}

export default Login