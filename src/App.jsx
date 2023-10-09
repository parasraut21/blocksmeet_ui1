

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { createContext } from "react";

//  import { SocketProvider } from '../BT/contexts/SocketContext'
// import UserProvider from './BT/contexts/UserContext';
//  import { GamesProvider } from './BT/contexts/MeetsContext'
 import { ContextProvider } from "./Context";
import { SocketProvider } from "./BT/contexts/SocketContext";
import { UserProvider } from "./BT/contexts/UserContext";
import { GamesProvider } from "./BT/contexts/MeetsContext";

import React, { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  InputBase,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ScheduleIcon from '@mui/icons-material/Schedule';
import JoinIcon from '@mui/icons-material/GroupAdd';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import Navbar from './BT/components/Navbar'
import Footer from './BT/components/Footer'
import { getAccount } from "./utils/wallet";
const context=createContext({});


import GamePage from './BT/components/GamePage'
import Menu from './BT/components/Menu'


function App() {

  const [account, setAccount] = useState(null);
  const [loading,setLoading] = useState(false);
  const [selectImg,setSelectImg] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);


  


   const hlo= async () => {
      const account = await getAccount();
      setAccount(account);

    }
    useEffect(()=>{
      hlo();
    })

  return (
    <>
  <ContextProvider>
  <context.Provider value={{account,setAccount,hlo,loading,setLoading,modalOpen,setModalOpen,selectImg,setSelectImg}}>

        <UserProvider>
          <SocketProvider>
            <Router>
              <Routes>
                <Route exact path='/' element={<Menu />} />
                <Route path='/Meet/:gameId' element={<GamesProvider><GamePage /></GamesProvider>} />
                <Route path='*' element={<Menu />} />
              </Routes>
            </Router>
          </SocketProvider>
        </UserProvider>
        </context.Provider>
        </ContextProvider>
    </>
  );
}

export default App;
export {context}
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Typography, AppBar } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';
// import { ContextProvider } from './Context';
// import Home from './Home';
// import Room from './Room';
// import Start from './components/Start';

// const App = () => {

//   return (
//    <>
//    <ContextProvider>
//      <Router>
//     <Routes>
//     <Route path="/" element={<Start />} />
//     <Route path="/WaitingRoom" element={<Home />} />
//     <Route path="/room/:roomID" element={<Room />} />
//     </Routes>
//   </Router>
//   </ContextProvider>,
//    </>
//   );
// };

// export default App;
