import React,{useState,useEffect} from "react";
import Logo from "../../../Social Club Logo.png";
import "./SearchBar.css";
import { useSelector } from "react-redux";
import { BiSearch } from "react-icons/bi";
import { MdClose } from "react-icons/md";  
import UserSlip from "../LeftSide/PeopleList/PeopleModal/UserSlip/UserSlip";

function SearchBar() {
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const { allUsers } = useSelector((state) => state.allUser);

  const handleFilter = (event) => {
  const searchWord = event.target.value;
  setWordEntered(searchWord);
  const newFilter = allUsers.filter((value) => {
    return value.userName.toLowerCase().includes(searchWord.toLowerCase());
  });

  if (searchWord === "") {
    setFilteredData([]);
  } else {
    setFilteredData(newFilter);
  }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className={`LogoSearch ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
      <img className="logoImg" src={Logo} alt="" />
      <div className="Search">
        <input type="text" placeholder="Find Friends..." value={wordEntered} onChange={handleFilter} />
        <div className="s-icon">
        {filteredData.length === 0 ? (
          <BiSearch/>
        ) : (
          <MdClose id="clearBtn" onClick={clearInput} />
        )}
          {/* <BiSearch/> */}
        </div>
      </div>
      {filteredData.length != 0 && (
        <div className={`dataResult ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <div  >
              <UserSlip data={value} key={key} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
