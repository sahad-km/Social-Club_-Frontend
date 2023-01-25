import React from 'react'
import SearchBar from '../../Home/SearchBar/SearchBar'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function UserPreview({data}) {
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  const navigate = useNavigate();

  const addToChat = (e)=>{
    e.preventDefault();
    try {
      fetch('http://localhost:8000/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
        body: JSON.stringify({
          senderId:user._id,
          receiverId:data._id
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json.result)
          navigate("/chat");
        });
    } catch (error) {
      console.log(error);
    }
  }

  if(!data) return <h3>Loading....</h3>
  return (
    <div className='col-md-3'>
    <SearchBar/>
    <div className={`InfoCard mb-3 mt-3  ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
      <div className="infoHead">
        <h5>Profile Info</h5>
          
      </div>

      <div className="info">
        {/* */}
        <span>
          <b>Status </b>
        </span>
        <span>{data.relationship}</span>
      </div>
      <div className="info">
        <span>
          <b>Lives in </b>
        </span>
        <span>{data.livesIn}</span>
      </div>
      <div className="info">
        <span>
          <b>Works as </b>
        </span>
        <span>{data.worksAs}</span>
      </div>
      <div className="info">
        <span>
          <b>Country</b>
        </span>
        <span>{data.country}</span>
      </div>
      <button onClick={(e)=>{addToChat(e)}} className="button logout-button">Say 'Hi'</button>
    </div>
    </div>
  )
}

export default UserPreview