import React, { Fragment, useEffect, useState } from "react";
import Logo from "../../../Img/man-157699.png";
import { useSelector } from "react-redux";
import UserSlip from "../../Home/LeftSide/PeopleList/PeopleModal/UserSlip/UserSlip";
import "./FriendsList.css";
import { Pagination, Modal } from "react-bootstrap";

function FriendsList({ data }) {
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [activePage, setActivePage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.user);
  if(!data) return <h3>Loading...</h3>
  const pageSize = 1; // number of items per page
  const pages = Math.ceil(data.followingFriends.length / pageSize);

  const currentData = data.followingFriends.slice((activePage - 1) * pageSize, activePage * pageSize);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }
  return (
    <Fragment>
      <div className={`FollowersCard ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
      <h3 style={{fontSize:'18px'}}>Friends List</h3>
      <>
       { currentData.length > 0 ? 
          currentData.map((user,id)=>{
            return(
              <UserSlip data={user} key={id} />
            )
          }) : <div className="text-center" style={{fontSize:'1em'}}>No friends in the list</div>
       }
      <Pagination
        activePage={activePage}
        items={pages}
        onSelect={handlePageChange}
      />
     {currentData.length > 1 && <span className='cursor-pointer' onClick={() => setShowModal(true)}>Show More</span> }
      <Modal show={showModal} onHide={() => setShowModal(false)}>
      <div style={{padding:'12px',borderRadius:'0.7em'}} >
        <h3 style={{ fontSize: "18px" }}>Friends List</h3>
        { data.followingFriends.filter((friend, i) => i !== 0 && friend._id !== user._id).map((user,id)=>{
        return(
          <UserSlip data={user} key={id} />
        )
      })}
      </div>
      </Modal>
    </>
    </div>
      </Fragment>
  );

}

export default FriendsList;
