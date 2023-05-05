import {useState,useEffect} from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter, Routes, Route ,Navigate,Router} from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CRUD from './pages/CRUD';
import SignUp from './pages/SignUp';
import UpdateProfile from './pages/UpdateProfile';
import Chatroom from './pages/Chatroom';
import Filestorage from './pages/Filestorage';

function App() {
  return (
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="profile" element={<Profile />} />
        <Route path="crud" element={<CRUD />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="updateProfile" element={<UpdateProfile />} />
        <Route path="chatroom" element={<Chatroom />} />
        <Route path="filestorage" element={<Filestorage />} />
      </Routes>
  </BrowserRouter>
);
  }
export default App;