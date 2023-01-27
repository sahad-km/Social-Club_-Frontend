import React, { useEffect, useState } from "react";
import "./PeopleKnow.css";
import { Pagination, Modal } from "react-bootstrap";
import Loader from "../../../Loader/Loader";
import MyModal from "./PeopleModal/MyModal";
import { useSelector, useDispatch } from "react-redux";
import { setAlluser } from "../../../../redux/actions/userAction";
import UserSlip from "./PeopleModal/UserSlip/UserSlip";

function PeopleKnow() {
  const { user } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token.token);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [loading, setLoading] = useState(false);
  const { allUsers } = useSelector((state) => state.allUser);
  const [isOpen, setIsOpen] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const id = user._id;
      setLoading(true);
      fetch(`${process.env.REACT_APP_BACKEND}/dashboard/all_users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Custom-Header": `${token}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          setLoading(false);
          const postCount = json.postCount;
          dispatch(setAlluser(json.userDetails));
        });
    }
  }, [dispatch,user]);

  if (!allUsers)
    return (
      <p className="text-center" style={{ marginTop: "2em" }}>
        There are no other users
      </p>
    );
  
  const pageSize = 1; // number of items per page
   const pages = Math.ceil(allUsers.length / pageSize);

  const currentData = allUsers.slice(
    (activePage - 1) * pageSize,
    activePage * pageSize
  );

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  if (loading) return <Loader />;
  
  return (
    <div className={`FollowersCard  ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`} >
      <h3 style={{ fontSize: "18px",marginBottom:'1em' }}>People you may know</h3>
      <>
        {currentData.map((user, id) => {
          return <UserSlip data={user} key={id} />;
        })}
        <Pagination
          activePage={activePage}
          items={pages}
          onSelect={handlePageChange}
        />
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Show More
        </span>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <div style={{padding:'12px',borderRadius:'0.7em'}} >
        <h3 style={{ fontSize: "18px" }}>People you may know</h3>
          {allUsers
            .filter((_, i) => i !== 0)
            .map((user, id) => {
              return <UserSlip data={user} key={id} />;
            })}
            </div>
        </Modal>
      </>
    </div>
  );
}

export default PeopleKnow;
