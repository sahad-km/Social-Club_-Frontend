import React, { useEffect } from 'react';
import './index.css'
import {createBrowserRouter,RouterProvider,BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import { useSelector } from 'react-redux';
import SignupPage from './Pages/Signup';
import LoginPage from './Pages/Login';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Chat from './Pages/Chat';
import UserPreview from './Pages/UserPreview';
import ExplorePage from './Pages/Explore';
import VideoCallPage from './Pages/VideoCall';
import NotFoundPage from './Pages/NotFoundPage';
import SinglePostPage from './Pages/SinglePostPage';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  const isDarkMode = useSelector((state) => state.isDarkMode);
  const { user } = useSelector((state) => state.user);
  return (
    <div className={isDarkMode ? 'dark-mode container-fluid ' : 'light-mode container-fluid '}>
     <BrowserRouter>
        <Routes>
          <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
          <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
          <Route path="/signup" element={user ? <Navigate to="/" /> : <SignupPage />} />
          <Route path="/user/:id" element={user ? <UserPreview /> : <Navigate to="/login" />} />
          <Route path="/explore" element={user ? <ExplorePage /> : <Navigate to="/login" />} />
          <Route path="/video_call/:id" element={user ? <VideoCallPage /> : <Navigate to="/login" />} />
          <Route path="/pageNotFound" element={user ? <NotFoundPage/> : <Navigate to="/login"/>} />
          <Route path="/single_post/:id" element={<SinglePostPage/>} />
          <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
   </div>
  );
}

export default App;
