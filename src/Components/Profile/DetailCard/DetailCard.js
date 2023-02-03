import React, { Fragment, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import './DetailCard.css'
import SearchBar from '../../Home/SearchBar/SearchBar';
import { FaPencilAlt } from "react-icons/fa";
import { logout } from '../../../redux/actions/userAction';
import EditModal from './EditModal/EditModal';
import Loader from '../../Loader/Loader';
import { toast } from 'react-toastify';

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

function DetailCard() {
  const { user } = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [isOpen,setIsOpen] = useState(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutBtn =()=>{
    toast.error("Logged out successfully",toastConfig);
    navigate('/login');
    localStorage.removeItem('token');
    dispatch(logout());

  }


  if(!user) return <Loader/>
  return (
    <Fragment>
    <div className='col-md-3'>
    <SearchBar/>
    <div className={`InfoCard mb-3 mt-3 ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
      <div className="infoHead">
        <h5>Profile Info</h5>
          <div>
            <FaPencilAlt onClick={() => {setIsOpen(true)}}  className='cursor-pointer'
              width="2rem"
              height="1.2rem"
            />
            <EditModal open={isOpen} onClose={()=> setIsOpen(false)} />
          </div>
          {/* <EditModal open={isOpen} onClose={()=> setIsOpen(false)} /> */}
      </div>

      <div className="info">
        {/* */}
        <span>
          <b>Status </b>
        </span>
        <span>{user.relationship}</span>
      </div>
      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{user.livesIn}</span>
      </div>
      <div className="info">
        <span>
          <b>Works as </b>
        </span>
        <span>{user.worksAs}</span>
      </div>
      <div className="info">
        <span>
          <b>Country </b>
        </span>
        <span className="info">{user.country}</span>
      </div>
      <button className="button logout-button" onClick={logoutBtn} >Logout</button>
    </div>
    </div>
     </Fragment>
  )
}

export default DetailCard