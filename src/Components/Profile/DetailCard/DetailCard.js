import React, { Fragment, useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode';
import { setUser } from '../../../redux/actions/userAction';
import { useSelector,useDispatch } from 'react-redux';
import './DetailCard.css'
import SearchBar from '../../Home/SearchBar/SearchBar';
import { FaPencilAlt } from "react-icons/fa";
import PeopleKnow from '../../Home/LeftSide/PeopleList/PeopleKnow';
import EditModal from './EditModal/EditModal';

function DetailCard() {
  const { user } = useSelector((state) => state.user);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [isOpen,setIsOpen] = useState(false)
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const id = decodedToken.userId;
      fetch(`${process.env.REACT_APP_BACKEND}/dashboard/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          dispatch(setUser(json.details));
        });
    }
  }, [dispatch]);

  if(!user) return <h4>Loading...</h4>
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
      <button className="button logout-button">Logout</button>
    </div>
    </div>
     </Fragment>
  )
}

export default DetailCard