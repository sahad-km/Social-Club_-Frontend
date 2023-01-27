import React, { useState, useEffect, useRef } from "react";
import altProfile from "../../../Img/man-157699.png";
import { AiOutlineCalendar } from "react-icons/ai";
import { BsCameraVideo } from "react-icons/bs";
import { HiOutlinePhoto } from "react-icons/hi2";
import { FaTimes } from "react-icons/fa";
import DatePicker from 'react-datepicker';
import { setUpload } from "../../../redux/actions/postAction";
import Loader from "../../Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";
import "./Share.css";
import { toast } from "react-toastify";

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

function Share() {
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [type,setType] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading,setLoading] = useState(false);
  const imageInput = useRef(null);
  const videoInput = useRef(null);
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.token.token);
  
  const handleFileChange = (event) => {
    setVideoFile(event.target.files[0]);
  }  

  const uploadPost = async () => {
    const type = !image ? "video" : "image";
    const file = !image ? videoFile : image;
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_UPLOAD_NAME}/${type}/upload`;
    setLoading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_UPLOAD_NAME);
    try {
        const res = await fetch(cloudinaryUrl, {
            method: "post",
            body: data,
        });
        const json = await res.json();
        const id = user._id;
        const url = json.url;
        if (selectedDate === null) {
            const postRes = await fetch(`${process.env.REACT_APP_BACKEND}/post/upload_image/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Custom-Header": `${token}`,
                },
                body: JSON.stringify({
                    url,
                    description,
                    type,
                }),
            });
            const postJson = await postRes.json();
            dispatch(setUpload(postJson.post));
            resetShare();
            setLoading(false);
            toast.success("Post shared successfully", toastConfig);
        } else {
            scheduledPosts(url);
        }
    } catch (err) {
        console.log(err);
    }
};


  //Handling scheduled posts
  const scheduledPosts =(url)=>{
    const id = user._id;
    fetch(`${process.env.REACT_APP_BACKEND}/post/scheduled_post/${id}` ,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Custom-Header": `${token}`,
      },
      body: JSON.stringify({
          url,
          description,
          type,
          scheduleTime:selectedDate
      }),
    })
    .then(res => res.json())
    .then(data => {
      resetShare();
      setLoading(false);
      toast.success("Post shared successfully", toastConfig);
    })
  }


  //Reset the share option
  const resetShare = () => {
    setImage(null);
    setVideoFile(null);
    setDescription('');
    setSelectedDate(null);
  };

  if(!user) return <Loader/>
  return (
    <div className={`PostShare ${isDarkMode ? 'dark-mode-inner' : 'light-mode-inner'}`}>    
    { user.profilePicture ? <img src={user.profilePicture} alt="No image found"/> : <img src={altProfile} alt='' /> }
      <div>
        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          name="description"
          type="text"
          placeholder="What's happening?"
        />
        <div className="postOptions">
          <div
            className="option"
            style={{ color: "green" }}
            onClick={() => imageInput.current.click()}
          >
            <HiOutlinePhoto style={{fontSize:'1.5em'}}/>
            Photo
            <input
            disabled={videoFile}
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              type="file"
              id="file"
              ref={imageInput}
              style={{ display: "none" }}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </div>

          <div
            className="option"
            style={{ color: "blue" }}
            onClick={() => videoInput.current.click()}>
            <BsCameraVideo style={{fontSize:'1.5em'}}/>
            Video
            <input
            disabled={image}
            onChange={handleFileChange}
              type="file"
              id="file"
              ref={videoInput}
              style={{ display: "none" }}
              accept="video/mp4,video/x-m4v,video/*"
            />
          </div>
          <div className="option" onClick={() => setVisible(!visible)}  style={{ color: "orange" }}>
          <AiOutlineCalendar style={{fontSize:'1.5em'}}/>
            Schedule
          </div>
          {visible &&  <DatePicker selected={selectedDate} onChange={date => setSelectedDate(date)} minDate={new Date()} />}
          <button
            className="button ps-button"
            onClick={uploadPost}
            disabled={loading}
          >
            {loading ? "Uploading" : "Share"}
          </button>
          {/* <div style={{ display: "none" }}>
      <input type="file" ref={imageRef} onChange={onImageChange} />
    </div> */}
        </div>
    {image && (
    <div className="previewImage">
      <FaTimes onClick={resetShare} />
      <img src={URL.createObjectURL(image)} alt="preview" />
    </div>
    )}
    {videoFile && (
    <div className="previewVideo">
      <FaTimes onClick={resetShare} />
      <video src={URL.createObjectURL(videoFile)} controls />
    </div>
    )}
      </div>
    </div>
  );
}

export default Share;
