
import { AppBar, Toolbar, IconButton, Typography, Grid, Avatar, ThemeProvider, createTheme, Switch } from '@mui/material';
import {
    Mic as MicIcon,
    MicOff as MicOffIcon,
    Videocam as VideocamIcon,
    VideocamOff as VideocamOffIcon,
    ScreenShare as ScreenShareIcon,
    StopScreenShare as StopScreenShareIcon,
    FiberManualRecord as ScreenRecordIcon,
    Stop as StopRecordIcon,
    Chat as ChatIcon,
    People as PeopleIcon,
    Close as CloseIcon,
    Brightness4 as DarkModeIcon
} from '@mui/icons-material';
import { Box } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SendIcon from '@mui/icons-material/Send';

import  {useContext } from 'react';
import { SocketContext } from './Context';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';


import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });


import { useSocket } from './contexts/SocketContext';
import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom'; 


import {   Paper, makeStyles } from '@material-ui/core';
const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Video = (props) => {
    const ref = useRef();

    useEffect(() => {
        props.peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    }, []);

    return (
        <StyledVideo playsInline autoPlay ref={ref} />
    );
}


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};

const useStyles = makeStyles((theme) => ({
  video: {
    width: '550px',
    [theme.breakpoints.down('xs')]: {
      width: '300px',
    },
  },
  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  },
}));

const Room = () => {

  const {  socket } = useContext(SocketContext);

  const classes = useStyles();

    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const userVideo = useRef();
    const peersRef = useRef([]);
    const { roomID } = useParams();

    useEffect(() => {
        socketRef.current = io.connect("https://blocksmeet-server.onrender.com");
        navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
            userVideo.current.srcObject = stream;
            socketRef.current.emit("join room", roomID);
            socketRef.current.on("all users", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer,
                    })
                    peers.push(peer);
                })
                setPeers(peers);
            })

            socketRef.current.on("user joined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer,
                })

                setPeers(users => [...users, peer]);
            });

            socketRef.current.on("receiving returned signal", payload => {
                const item = peersRef.current.find(p => p.peerID === payload.id);
                item.peer.signal(payload.signal);
            });
        })
    }, []);

    function createPeer(userToSignal, callerID, stream) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });

        peer.on("signal", signal => {
            socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
        })

        return peer;
    }

    function addPeer(incomingSignal, callerID, stream) {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returning signal", { signal, callerID })
        })

        peer.signal(incomingSignal);

        return peer;
    }





    const [isMicOn, setMicOn] = useState(true);
    const [isCamOn, setCamOn] = useState(true);
    const [isSharingScreen, setSharingScreen] = useState(false);
    const [isRecording, setRecording] = useState(false);
    const [isDarkMode, setDarkMode] = useState(false);
    const theme = createTheme({
        palette: {
            mode: isDarkMode ? 'dark' : 'light',
        },
    });
    const [isDialogOpen, setDialogOpen] = useState(false);

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleLeaveMeeting = () => {
        // Logic for leaving the meeting
        navigate('/')
        setDialogOpen(false);
    };
    const [isChatOpen, setChatOpen] = useState(false);
    const [message, setMessage] = useState('');

    const handleChatToggle = () => {
        setChatOpen(!isChatOpen);
    };

  

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        // Handle file upload functionality here
    };
    const [messages, setMessages] = useState([]);

    const handleSendMessage = () => {
        if (message.trim()) {
            setMessages([...messages, message]);
            setMessage('');
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

//


  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  //
  const [chats, setChats] = useState([]);

  const [myName, setMyName] = useState("");
  const [txt, setTxt] = useState("");
  const [chat, setChat] = useState("");
  const [users, setUsers] = useState([]);
  const [myFile, setMyFile] = useState("");
  const [emo, setEmo] = useState(false);
  const [vidility, setVidility] = useState(false);
  const { gameId } = useParams()
  const emojis = [
    "✌",
    "😂",
    "😝",
    "😁",
    "😱",
    "👉",
    "🙌",
    "🍻",
    "🔥",
    "🌈",
    "☀",
    "🎈",
    "🌹",
    "💄",
    "🎀",
    "⚽",
    "🎾",
    "🏁",
    "😡",
    "👿",
    "🐻",
    "🐶",
    "🐬",
    "🐟",
    "🍀",
    "👀",
    "🚗",
    "🍎",
    "💝",
    "💙",
    "👌",
    "❤",
    "😍",
    "😉",
    "😓",
    "😳",
    "💪",
    "💩",
    "🍸",
    "🔑",
    "💖",
    "🌟",
    "🎉",
    "🌺",
    "🎶",
    "👠",
    "🏈",
    "⚾",
    "🏆",
    "👽",
    "💀",
    "🐵",
    "🐮",
    "🐩",
    "🐎",
    "💣",
    "👃",
    "👂",
    "🍓",
    "💘",
    "💜",
    "👊",
    "💋",
    "😘",
    "😜",
    "😵",
    "🙏",
    "👋",
    "🚽",
    "💃",
    "💎",
    "🚀",
    "🌙",
    "🎁",
    "⛄",
    "🌊",
    "⛵",
    "🏀",
    "🎱",
    "💰",
    "👶",
    "👸",
    "🐰",
    "🐷",
    "🐍",
    "🐫",
    "🔫",
    "👄",
    "🚲",
    "🍉",
    "💛",
    "💚",
  ];


//   socket.on("new", (name) => {
//     console.log("***********************8",name)
//     setChats([
//       ...chats,
//       {
//         type: "text",
//         msg: `joined the chat`,
//         loc: "center",
//         action: "light text-success shadow",
//         name: name,
//       },
//     ]);

//     setUsers([...users, name]);
//   });
//   socket.on("left", (name) => {
//     if (name !== null) {
//       setChats([
//         ...chats,
//         {
//           type: "text",
//           msg: `left the chat`,
//           loc: "center",
//           action: "light  text-danger shadow",
//           name: name,
//         },
//       ]);
//       let usr = users;
//       for (let i = 0; i < usr.length; i++) {
//         usr.splice(i, 1);
//       }
//       setUsers(usr);
//     }
//   });
//   socket.on("message", (data) => {
//     if (data.type == "text") {
//       setChats([
//         ...chats,
//         {
//           type: "text",
//           msg: `${data.message}`,
//           loc: "left",
//           action: "dark",
//           name: data.name,
//         },
//       ]);
//     }
//     if (data.type == "file") {
//       setChats([
//         ...chats,
//         {
//           type: "file",
//           loc: "left",
//           name: data.name,
//           url: data.url,
//         },
//       ]);
//     }
//   });
  const word = (sen, num) => {
    return sen.trim().split(" ")[num];
  };
  const uniSend = () => {
    let cmd = word(chat, 0) == "cmd";
    if (cmd) {
      console.log(cmd);
      if (word(chat, 1) == "clear") {
        setChats([]);
      }
      if (word(chat, 1) == "lorem") {
        const lorem =
          "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ratione neque aut et possimus, dolorem quam, praesentium quis nisi ut enim labore perspiciatis saepe quisquam aliquid, corrupti nobis repellendus omnis itaque!";
        setChats([
          ...chats,
          {
            type: "text",
            msg: `${lorem}`,
            name: "you",
            action: "dark",
            loc: "right",
          },
        ]);
        socket.emit("send", { type: "text", msg: lorem ,gameId : gameId});
      }
    } else {
      setChats([
        ...chats,
        {
          type: "text",
          msg: `${chat}`,
          name: "you",
          action: "dark",
          loc: "right",
        },
      ]);
      socket.emit("send", { type: "text", msg: chat ,gameId: gameId });
    }

    setChat("");
  };
  const send = (e) => {
    if (myName == undefined) {
      window.location.reload();
    }
    if (e.keyCode == 13 && chat !== "") {
      uniSend();
    }
  };

  const btnSend = () => {
    if (myName == undefined) {
      window.location.reload();
    }
    if (chat !== "") {
      uniSend();
    }
  };
  const linkify = (data) => {
    let arr = data.split(" ");
    function isValidURL(str) {
      var res = str.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
      let stmnt = res !== null;
      if (stmnt) {
        return (
          <a href={str} key={str + Math.random() * 1000} target="_blank">
            {str}
          </a>
        );
      } else {
        return str;
      }
    }
    let alldata = arr.map((a) => {
      return isValidURL(a);
    });
    return alldata;
  };
  const handleFile = (e) => {
    let el = e.target;
    function loadAsUrl() {
      var selected = e.target.files;
      var fileToLoad = selected[0];
      var fileReader = new FileReader();
      fileReader.onload = function (fle) {
        let dataUrl = fle.target.result;
        setChats([
          ...chats,
          { type: "file", url: dataUrl, name: "you", loc: "right" },
        ]);
        socket.emit("send", { type: "file", url: dataUrl , gameId : gameId });
      };
      fileReader.readAsDataURL(fileToLoad);
    }
    loadAsUrl();
  };
  const mention = (e) => {
    setChat(chat + " @" + e.target.textContent + " ");
    document.querySelector("#chatbox").focus();
  };
  const emoShow = (e) => {
    let x = e.clientX;
    let y = e.clientY;
    if (emo) {
      setEmo(false);
    } else if (myName !== "") {
      setEmo(true);

 
    }
  };
 
    return (
        <ThemeProvider theme={theme}>
            <Box style={{ height: '100vh' }}>
                <div style={{ height: '100vh'}}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" style={{ flexGrow: 1 }}>
                                Meeting Title
                            </Typography>
                            <IconButton color="inherit">
                                <SettingsIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={() => setDarkMode(!isDarkMode)}>
                                <DarkModeIcon />
                            </IconButton>
                            <IconButton color="inherit" onClick={handleDialogOpen}>
                                <CloseIcon />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <Grid container style={{ height: 'calc(100vh - 64px)' }}>
                        {/* Video and main content area */}

                                <Container>
                                <Grid container className={classes.gridContainer}>
                <Paper className={classes.paper}>
                <Grid item xs={12} md={6}>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
             {peers.map((peer, index) => {
               return (
                <>
               
                    <Video key={index} peer={peer}  />
                    
                  </>
                );
            })}
            </Grid>
                    </Paper>
                  </Grid>
        </Container>

                        <Grid item xs={12} sx={{ background: theme.palette.background.default, position: 'relative' }}>

                            {/* Ideally this is where the video stream would appear */}
                            <div style={{ position: 'absolute', bottom: 10, left: 10 }}>
                                <Avatar alt="Profile Picture" src="/static/images/avatar/1.jpg" />
                                <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary }}>
                                    Username
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>

                    {/* Bottom Control Bar */}
                    <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={() => setMicOn(!isMicOn)}>
                            {isMicOn ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={() => setCamOn(!isCamOn)}>
                            {isCamOn ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={() => setSharingScreen(!isSharingScreen)}>
                            {isSharingScreen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                        </IconButton>
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={() => setRecording(!isRecording)}>
                            {isRecording ? <StopRecordIcon /> : <ScreenRecordIcon />}
                        </IconButton>
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={handleClickOpen}>
                            <ChatIcon />
                        </IconButton>
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'}>
                            <PeopleIcon />
                        </IconButton>
                        {/* Add more controls as needed */}
                    </div>

                    <Drawer
                        anchor="right"
                        open={isChatOpen}
                        onClose={handleChatToggle}
                    >
                        <div style={{ width: 320, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <AppBar position="static">
                                <Toolbar>
                                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                                        Chat
                                    </Typography>
                                    <IconButton edge="end" color="inherit" onClick={handleChatToggle}>
                                        <CloseIcon />
                                    </IconButton>
                                </Toolbar>
                            </AppBar>

                            {/* Chat messages would go here */}
                            <div style={{ overflowY: 'auto', flexGrow: 1, padding: 10 }}>
                                    {messages.map((msg, index) => (
                                        <div key={index} style={{ marginBottom: 10 }}>
                                            {msg}
                                        </div>
                                    ))}
                                </div>

                            <div style={{ padding: 10, marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
                                <IconButton>
                                    <EmojiEmotionsIcon />
                                </IconButton>
                                <IconButton component="label">
                                    <AttachFileIcon />
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </IconButton>
                               
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={message}
                                    onChange={handleMessageChange}
                                    placeholder="Type your message..."
                                    onKeyPress={handleKeyPress}
                                />
                                <IconButton onClick={handleSendMessage}>
                                    <SendIcon />
                                </IconButton>
                            </div>
                        </div>
                        
                    </Drawer>
                    
                </div>
            </Box>
            <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
       
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Close
            </Typography>
          
          </Toolbar>
        </AppBar>
      
 <div className="shadow  p-2 mb-4 flex justify-between">
        <div className="flex space-x-4">
          <div
            className="shadow p-2 flex bg-red-400 justify-center items-center rounded-full"
            style={{
              position: "absolute",
              right: "6rem",
              width: "3rem",
              height: "3rem",
            }}
            onClick={() => {
              if (vidility) {
                setVidility(false);
                localStream.getVideoTracks()[0].stop();
              } else {
                setVidility(true);
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"
              />
            </svg>
          </div>

  
          <div
            className="shadow p-3 select-none"
            style={{
              position: "fixed",
              right: 0,
              height: "5rem",
              width: "5rem",
              overflowY: "auto",
            }}
          >
            {users.map((el) => {
              return (
                <div
                  className="pl-1 truncate break-all"
                  onClick={mention}
                  key={Math.random() * 10000}
                  style={{ cursor: "pointer" }}
                >
                  {el}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div onDoubleClick={emoShow}>
        {chats.map((data) => {
          return data.type == "text" ? (
            <div
              key={Math.random() * 1000}
              className={`my-2`}
              style={{ textAlign: data.loc }}
            >
              <div
                className={`inline-block shadow bg-black text-orange-400 select-none rounded-t px-4 mx-1 btn-${data.action}`}
                style={{
                  width: "clamp(50vw, 60vw, 80vw)",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setChat(` @${data.name} `);
                  document.querySelector("#chatbox").focus();
                }}
              >
                {data.name}
              </div>
              <div
                className={`inline-block py-2 rounded-b px-4 mx-1 btn-${data.action}`}
                style={{
                  width: "clamp(50vw, 60vw, 80vw)",
                }}
              >
                {linkify(data.msg).map((nr) => {
                  if (typeof nr == "string") {
                    return ` ${nr} `;
                  } else {
                    return nr;
                  }
                })}
              </div>
            </div>
          ) : (
            <div
              key={Math.random() * 1000}
              className={`my-2 shadow`}
              style={{ textAlign: data.loc }}
            >
              <div
                className="inline-block px-3 mx-2 rounded-t btn-dark py-1 shadow"
                style={{ width: "15rem" }}
              >
                {data.name}
              </div>
              <br />
              <img
                style={{ width: "15rem" }}
                className="mx-2 rounded-b"
                src={data.url}
                alt="image"
              />
            </div>
          );
        })}
      </div>
      <br />
      <br />
      <br />
        <div
          className="p-3 fixed bottom-0 flex bg-light shadow"
          style={{ boxShadow: "0 0 10px rgba(0,0,0,.1)" }}
        >
          <input
            type="text"
            placeholder="Chat.."
            value={chat}
            className="card py-1 px-2 shadow outline-none w-1/2"
            onChange={(e) => {
              setChat(e.target.value);
            }}
            onKeyUp={send}
            id="chatbox"
          />
          <button className="btn mx-1 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
              />
              <path
                d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"
              />
            </svg>
          </button>
          <label htmlFor="file" className="btn btn-link mx-1 shadow text-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M4.502 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"
              />
              <path
                d="M14.002 13a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2V5A2 2 0 0 1 2 3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-1.998 2zM14 2H4a1 1 0 0 0-1 1h9.002a2 2 0 0 1 2 2v7A1 1 0 0 0 15 11V3a1 1 0 0 0-1-1zM2.002 4a1 1 0 0 0-1 1v8l2.646-2.354a.5.5 0 0 1 .63-.062l2.66 1.773 3.71-3.71a.5.5 0 0 1 .577-.094l1.777 1.947V5a1 1 0 0 0-1-1h-10z"
              />
            </svg>
          </label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleFile}
            accept="image/*"
          />
  
          {emo ? (
            <div
              className="bg-white shadow p-2 rounded select-none"
              style={{
                position: "fixed",
                bottom: "5rem",
                width: "20rem",
                height: "30rem",
                right: "5rem",
              }}
              id="emos"
            >
              {emojis.map((data) => {
                return (
                  <span
                    className="inline-block m-1 cursor-pointer"
                    key={data}
                    onClick={(e) => {
                      setChat(chat + e.target.innerText);
                      document.querySelector("#chatbox").focus();
                    }}
                  >
                    {data}
                  </span>
                );
              })}
            </div>
          ) : (
            <div></div>
          )}
  
          <button
            className="btn shadow"
            onClick={() => {
              emo ? setEmo(false) : setEmo(true);
              document.querySelector("#chatbox").focus();
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0-1a8 8 0 1 1 0 16A8 8 0 0 1 8 0z"
              />
              <path
                d="M4.285 6.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 4.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 3.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zM7 9.5C7 8.672 6.552 8 6 8s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5zm4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5.448 1.5 1 1.5 1-.672 1-1.5z"
              />
            </svg>
          </button>
          <button
            className="btn btn-white text-success mx-1 shadow"
            onClick={btnSend}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z"
              />
            </svg>
          </button>
          <button className="btn shadow">setting</button>
        </div> 
      
      </Dialog>

            <Dialog
                open={isDialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Leave Meeting"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to leave the meeting?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLeaveMeeting} color="primary" autoFocus>
                        Leave
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default Room;