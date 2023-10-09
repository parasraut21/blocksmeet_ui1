import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateId } from '../helpers'
import { useUser } from '../contexts/UserContext'
import { useSocket } from '../contexts/SocketContext'
import Loader from './Loader'
import Navbar from './Navbar'
import Footer from './Footer'
import { useContext } from "react";

import { inDevelopment } from '../vars'

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
import { context } from '../../App'

export default function Menu() {
  const {account} = useContext(context);

  const [myGames, setMyGames] = useState()
  const [loading, setLoading] = useState(false)
  const [isPrivate, setIsPrivate] = useState()
  const [onlineUsers, setOnlineUsers] = useState([])
  const navigate = useNavigate()
  const [joiningGame, setJoiningGame] = useState(false);
  const socket = useSocket()
  const { username, id } = useUser()
  const [gameId, setGameId] = useState("");
  let showOnline = true;
    const handleGameIdChange = (event) => {
    setGameId(event.target.value);
  };

  const handleJoinGameClick = () => {
    console.log("join");
    setJoiningGame(true);
  };

  const handleJoinWithGameId = async () => {
  
    setLoading(true)
    socket.emit("join room", gameId);
    socket.emit("bt", username,account,gameId);
    console.log("Joining game with ID:", gameId);
  
    navigate(`/Meet/${gameId}`);
        setLoading(false)
      
   
  };
  useEffect(() => {
    if(!socket) return
    socket.emit('username', username)
  }, [username, socket])

  useEffect(() => {
    if(!socket) return
    function gotogame(id) {
      socket.emit("join room", id);
      socket.emit("bt", username,account,id);
      navigate('/Meet/' + id)
    }
    socket.on('game id', gotogame)
    socket.emit('get-users')
    socket.on('get-users', _users => {
      setOnlineUsers(_users)
    })
    return () => {
      socket.off('game id')
      socket.off('get-users')
    }
  }, [socket])

  //
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState('');
  const openJoinDialog = () => {
    setIsJoinDialogOpen(true);
  };

  const closeJoinDialog = () => {
    setIsJoinDialogOpen(false);
  };

  const openCopyDialog = () => {
    setIsCopyDialogOpen(true);
  };

  const closeCopyDialog = () => {
    setIsCopyDialogOpen(false);
  };

  const copyLinkToClipboard = () => {
    const linkToCopy = 'https://example.com'; 
    navigator.clipboard.writeText(linkToCopy).then(() => {
      setCopiedLink(linkToCopy);
      setIsSnackbarOpen(true);
    });
  };

  return (
    <>
<Navbar/>
{showOnline && <div className="fixed top-8 left-8 bg-gray-100 p-2 rounded text-white">Online: {onlineUsers.length}</div>}
    <div
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px', 
            padding: '20px',
            borderRadius: '15px',
            background: 'white',
            boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Stack sx={[{ marginLeft: '40vw', marginTop: '20vh' }]}>
            <Stack direction={{ xs: 'row' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<VideoCallIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
                // onClick={openCopyDialog}
                onClick={() => {
                  setLoading(true);
                  socket.emit('create');
                 
                }}
              >
                Start
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ScheduleIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
              >
                Schedule
              </Button>
            </Stack>

            <Stack direction={{ xs: 'row' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<JoinIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
                onClick={openJoinDialog}
              >
                Join
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HistoryIcon />}
                sx={{
                  width: '140px',
                  height: '140px',
                  marginTop: '1vh',
                  marginLeft: '0.5vh',
                  marginRight: '0.5vh',
                }}
              >
                History
              </Button>
            </Stack>
          </Stack>
        </div>
      </div>

  
      <Dialog open={isJoinDialogOpen} onClose={closeJoinDialog}>
        <DialogTitle>Join Meeting</DialogTitle>
        <DialogContent>
          <Typography>Enter Meeting ID:</Typography>
          {/* <InputBase placeholder="Meeting ID" /> */}
          <InputBase
            placeholder="Meeting ID"
            value={gameId}
            onChange={handleGameIdChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeJoinDialog} color="primary">
            Cancel
          </Button>
          {/* <Button onClick={closeJoinDialog} color="primary">
            Join
          </Button> */}
           <Button onClick={handleJoinWithGameId} color="primary" disabled={loading}>
            {loading ? 'Joining...' : 'Join'}
          </Button>
        </DialogActions>
      </Dialog>

  
      <Dialog open={isCopyDialogOpen} onClose={closeCopyDialog}>
        <DialogTitle>Copy Link to Clipboard</DialogTitle>
        <DialogContent>
          <Button variant="contained" color="primary" onClick={copyLinkToClipboard}>
            Copy to Clipboard
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCopyDialog} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={() => setIsSnackbarOpen(false)}
        message={`Link copied: ${copiedLink}`}
      />
         <Footer/>
    </>
  );
}