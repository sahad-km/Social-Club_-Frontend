import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MdPhone, MdSettings, MdHome } from "react-icons/md";
import { IoChatbubblesSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../../../redux/actions/themeAction";
import PeopleKnow from "../LeftSide/PeopleList/PeopleKnow";

function RightSide() {
  const icon_style = {
    fontSize: "1.5em"
  };

  const dark_mode = {
    backgroundColor:'#1a1919',
    color:'white',
    display: "block",
    textAlign:'center'
  }
  const light_mode = {
    backgroundColor:'white',
    color:'black',
    display: "block",
    textAlign:'center'
  }

  const [showMenu, setShowMenu] = useState(false);
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClick = (event) => {
      if (event.target.closest('.col-3.col-md-3') === null) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <Fragment>
      <div className="col-md-3">
        <div className="row p-4">
          <div className="col-3 col-md-3">
            <Link to={'/'}>
            <MdHome style={icon_style} />
            </Link>
          </div>
          <div className="col-3 col-md-3">
            <MdSettings className="link" style={icon_style} onClick={toggleMenu} />
            {showMenu && (
              <div className="dropdown-menu" style={isDarkMode ? dark_mode : light_mode}>
                <div class="custom-control custom-switch">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    id="customSwitches"
                    checked={isDarkMode}
                    onChange={() => dispatch(setTheme())}
                  />
                  <label class="custom-control-label" for="customSwitches">
                    Dark Mode
                  </label>
                </div>
                
              </div>
            )}
          </div>
          <div className="col-3 col-md-3">
            <Link to={"/video_call"}>
              <MdPhone style={icon_style} />
            </Link>
          </div>
          <div className="col-3 col-md-3">
            <Link to={"/chat"}>
              <IoChatbubblesSharp style={icon_style} />
            </Link>
          </div>
        </div>
        <PeopleKnow />
      </div>
    </Fragment>
  );
}

export default RightSide;
