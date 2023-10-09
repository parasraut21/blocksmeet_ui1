import React, { useState, useEffect } from "react";
import { useContext } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from "./Blockchain/Modal";
import "./Blockchain/Display.css"
// import "./Blockchain/FileUpload.css"
import axios from "axios";
import { tezos } from "../../utils/tezos";
import { context } from "../../App";
import { fetchStorage } from "../../utils/tzkt";
import { getAccount } from "../../utils/wallet";
import {RxCrossCircled} from "react-icons/rx";
import {BiShareAlt} from "react-icons/bi"
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
// import VideoRoom from "./VideoRoom";

import VpnLockIcon from '@mui/icons-material/VpnLock';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';

//
// import NewVideo from './NewVideo';

import Slide from '@mui/material/Slide';
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

//
import { useSocket } from '../contexts/SocketContext';
import { useParams, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext';
import {   Paper, makeStyles } from '@material-ui/core';
import  {  useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
// import { useNavigate, useParams } from 'react-router-dom'; 
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

const Home = () => {

// 
const {modalOpen} = useContext(context);
const classes = useStyles();

const [peers, setPeers] = useState([]);
const socketRef = useRef();
const userVideo = useRef();
const peersRef = useRef([]);
const { gameId } = useParams();

useEffect(() => {
    socketRef.current = io.connect("https://blocksmeet-server.onrender.com");
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit("join room", gameId);
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



  const socket = useSocket()
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

    //
    const { id, username } = useUser();
    const [opponentSocketId, setOpponentSocketId] = useState('')
    const [mySocketId, setMySocketId] = useState('')
    useEffect(() => {
      if (!socket) return;
      socket.emit("join game", gameId, username ? username : "Guest",socket.id);
  
      socket.on('getOSID' , (socketId)=>{
      setOpponentSocketId(socketId)
 
       })
  
        console.log("._________________",opponentSocketId)
  
    }, [socket]);
  
    useEffect(() => {
     
      socket.on('createSIDB', (socketId) => {
        setMySocketId(socketId)
        // console.log("Creator socket.id: ", socketId);
      });
  
      // socket.on('OppoISDB', (socketId) => {
      //   setOpponentSocketId(socketId)
      //   console.log("createSIDB socket.id: ", mySocketId);
      // });
  
    }, []);
  

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleLeaveMeeting = () => {
        // Logic for leaving the meeting
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
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen,setDrawerOpen] = useState(false)
  const [isDrawerOpen2,setDrawerOpen2] = useState(false)
  const [isAddressDialogOpen, setAddressDialogOpen] = useState(false);
  const [myName, setMyName] = useState("");
  const [txt, setTxt] = useState("");
  const [chat, setChat] = useState("");
  const [users, setUsers] = useState([]);
  const [myFile, setMyFile] = useState("");
  const [emo, setEmo] = useState(false);
  const [vidility, setVidility] = useState(false);
  // const { gameId } = useParams()
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

 

 


  socket.on("new", (name) => {
    // Check if the name is already in the users array
    if (!users.includes(name)) {
      // setChats([
      //   ...chats,
      //   {
      //     type: "text",
      //     msg: `joined the chat`,
      //     loc: "center",
      //     action: "light text-success shadow",
      //     name: name,
      //   },
      // ]);
  
      // Only add the name if it's not already in the users array
      setUsers([...users, name]);
    }
  });
  socket.on("left", (name) => {
    if (name !== null) {
      setChats([
        ...chats,
        {
          type: "text",
          msg: `left the chat`,
          loc: "center",
          action: "light  text-danger shadow",
          name: name,
        },
      ]);
      let usr = users;
      for (let i = 0; i < usr.length; i++) {
        usr.splice(i, 1);
      }
      setUsers(usr);
    }
  });
  socket.on("message", (data) => {
    if (data.type == "text") {
      setChats([
        ...chats,
        {
          type: "text",
          msg: `${data.message}`,
          loc: "left",
          action: "dark",
          name: data.name,
        },
      ]);
    }
    if (data.type == "file") {
      setChats([
        ...chats,
        {
          type: "file",
          loc: "left",
          name: data.name,
          url: data.url,
        },
      ]);
    }
  });
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
    setSelectedUser(e);
    setAddressDialogOpen(true);
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

  const [userAccounts, setUserAccounts] = useState({});

  useEffect(() => {


    socket.on("BT", (username, account) => {
      console.log("Luffy----------",username,"-",account)
      setUserAccounts((prevUserAccounts) => ({
        ...prevUserAccounts,
        [username]: account,
      }));
    });
     
    // socket.on("BT", (username,account) => {
    //   console.log("Luffy----------",username,"-",account)
     
    //  });

    return () => {
      socket.off("BT");
    };
     
  }, []);


  const getWalletAddress = (selectedUser) =>{
    const account = userAccounts[selectedUser];
    console.log(`Wallet address for ${selectedUser}: ${account}`);
    return account;
  }
 
  //file share
  const {account} = useContext(context);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  // const [loading, setLoading] = useState(false);
  // const {loading,setLoading}=useContext(context);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        setLoading(true)
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            // pinata_api_key: `ba976f7f1755c3f08e18`,
            pinata_api_key: `
            ea23e88f2a89ec4317a6`,
            pinata_secret_api_key: `
            12d0d50af9e8be6daa8b94b36dd2c39ae303470fae5532904eb9518e65e78485`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        
      
        try{
          const contract = await tezos.wallet.at("KT1T3m3FarBi44wp8z4KcRUY45NSZGU9QBBJ");
          const op =await contract.methods.add(ImgHash).send();
          setLoading(true);
          await op.confirmation(1);
          setLoading(false);
          alert("Successfully Image Uploaded");
          setFileName("No image selected");
          setFile(null);
        }
        catch(err){
          throw err;
        }
     
          
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
      setLoading(false)

    }
    setFileName("No image selected");
    setFile(null);
  };

  const retrieveFile = (e) => {
    e.preventDefault();
    const data = e.target.files[0]; //files array of files object
    console.log(data);
    const reader = new FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
  };

  //display
  const [data, setData] = useState(""); 
  const [account1, setAccount] = useState(null);
  const [MyL,setMyL] = useState();
  const {loading,setLoading} = useContext(context);
  const {modalopen,setModalOpen}=useContext(context);
  const {selectImg,setSelectImg}=useContext(context);

  const getdata = async () => {
    const account = await getAccount();
    setAccount(account);
    let dataArray;
    const storage = await fetchStorage();
    const my_map = storage.user;
  
    if (my_map) {
      if (my_map.hasOwnProperty(account)) {
        const my_list = my_map[account];
        dataArray = Object.keys(my_list);
        if (dataArray[0]) {
          const str = dataArray.toString();
          const str_array = str.split(",");
          console.log(str_array);
  
          const images = str_array.map((item, i) => {
            return (
              <a key={i}>
                <img
                  key={i}
                  src={`https://gateway.pinata.cloud/ipfs/${item.substring(34)}`}
                  alt="new"
                  className="image-list"
                ></img>
                <BiShareAlt
                  style={{
                    cursor: "pointer",
                    display: "absolute",
                    marginTop: "-583px",
                    color: "black",
                    marginLeft: "131px",
                    fontSize: "30px",
                  }}
                  onClick={() => setContent(item)}
                />
                <RxCrossCircled
                  style={{
                    cursor: "pointer",
                    display: "absolute",
                    marginTop: "-560px",
                    color: "red",
                    marginLeft: "131px",
                    fontSize: "30px",
                  }}
                  onClick={() => deleteImage(item)}
                />
              </a>
            );
          });
          setData(images);
        } else {
          alert("No image to display");
        }
      } else {
        alert("No image to display");
      }
    } else {
      alert("Storage data not available");
    }
  };

  const getOtherData = async()  => {
    const account = await getAccount();
    setAccount(account);
    let dataArray;
    let d;
    const Otheraddress = document.querySelector(".address").value;
    console.log(Otheraddress);



    const storage = await fetchStorage();
    if (Otheraddress && Otheraddress!=account ) {
        const my_map = storage.access_user;
        if(my_map.hasOwnProperty(Otheraddress)){
          console.log("hii");
          const my_list = my_map[Otheraddress];
          if(my_list.hasOwnProperty(account)){
            console.log("hello");
            const my_imgs = my_list[account];
            const imgs = Object.keys(my_imgs);
            const str = imgs.toString(); 
            const str_array = str.split(",");
                    
          const images = str_array.map((item, i) => {
            return (
                <a key={i}>
                <img
                  key={i}
                  src={`https://gateway.pinata.cloud/ipfs/${item.substring(34)}`}
                  alt="new"
                  className="image-list"
                ></img>
              </a>
            );
          });
          setData(images);

            // if(my_imgs.hasOwnProperty(url)){
            //   const image = (()=>{return (
            //             <>
            //             <a href={url} target="_blank">
            //               <img
            //                 src={url}
            //                 alt="new"
            //                 className="image-list"
            //                 style={{display:"relative"}}
            //               ></img>
            //             </a>
            //             </>
            //           );});
            //           setData(image);


            // }

          }else{
            alert("You don't have access")
          }
        }else{
          alert("User is not registered");
        }
      }
      else{
        alert("Enter correct value");
      }

          
          // if(my_L[0]){
          //     dataArray = my_L;
          //     const str = dataArray.toString();
          //     const str_array = str.split(",");
          //     const images = str_array.map((item, i) => {
          //       return (
          //         <>
          //         <a href={item} key={i} target="_blank">
                   
          //           <img
          //             key={i}
          //             src={`https://gateway.pinata.cloud/ipfs/${item.substring(34)}`}
          //             alt="new"
          //             className="image-list"
          //             style={{display:"relative"}}
          //           ></img>
                    
          //         </a>
          //         </>
          //       );
          //     });
          //     setData(images);
          //   }else{
          //     alert("No image present at that address")
          //   }}
         

  };

  const hideOther = () => {
    const Otheraddress = document.querySelector(".address").value;
    if(Otheraddress && account){
      window.location.reload();
    }else{
      alert("No image to hide");
    }

  }

  const deleteImage = async (img) => {
    try{
      const contract = await tezos.wallet.at("KT1T3m3FarBi44wp8z4KcRUY45NSZGU9QBBJ");
      // setContract(contract)
      const op =await contract.methods.deleteImg(img).send();
      await op.confirmation(1);
      alert("Removed Successfully");
      window.location.reload();
     
    }
    catch(err){
      alert("Try Again");
      
    } 
    
}
const setContent = async (item) => {
  setModalOpen(true);
  setSelectImg(item);

}
 
    return (
        <ThemeProvider theme={theme}>
            <Box style={{ height: '100vh', }}>
                <div style={{ height: '100vh',  }}>
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
                    {modalOpen && (
        <Modal></Modal>
      )}

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
                        <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={() => setDrawerOpen(true)}>
              <PeopleIcon />
            </IconButton>

            <IconButton color={theme.palette.mode === 'dark' ? 'primary' : 'inherit'} onClick={() => setDrawerOpen2(true)}>
              <VpnLockIcon />
            </IconButton>
                        {/* Add more controls as needed */}
                    </div>


                    <Drawer anchor="right" open={isDrawerOpen} onClose={() => setDrawerOpen(false)}>
  <div style={{ width: '250px', padding: '10px' }}>
    <h2 style={{ fontWeight: 'bold', textAlign: 'center', margin: '10px 0' }}>
      Participants
    </h2>
    {users.map((user) => (
      <div
        key={Math.random() * 10000}
        className="pl-1 truncate break-all"
        onClick={() => mention(user)}
        style={{ cursor: 'pointer' }}
      >
        {user}
      </div>
    ))}
  </div>
</Drawer>

{/* <Drawer anchor="right" open={isDrawerOpen2} onClose={() => setDrawerOpen2(false)}>
  <div style={{ width: '250px', padding: '10px' }}>
    <h2 style={{ fontWeight: 'bold', textAlign: 'center', margin: '10px 0' }}>
      Secure File Sharing
    </h2>
  </div>
</Drawer> */}
{/* File sharing */}
<Drawer anchor="right" open={isDrawerOpen2} onClose={() => setDrawerOpen2(false)}>
        <div style={{ width: '250px', padding: '10px' }}>
          <h2 style={{ fontWeight: 'bold', textAlign: 'center', margin: '10px 0' }}>
            Secure File Sharing
          </h2>
          <h6>{account}</h6>

          {/* Your existing form */}
          <div className="top">
            <form className="form" onSubmit={handleSubmit}>
              <label htmlFor="file-upload" className="">
                Choose Image
              </label>
              <input
                disabled={!account}
                type="file"
                id="file-upload"
                name="data"
                onChange={retrieveFile}
                className="bg-dark text-white"
              />
              <span className="textArea">Image: {fileName}</span>
              <button type="submit" className="upload btn btn-warning" disabled={!file}>
                Upload File
              </button>
              {loading ? (
                <div className="Background">
                  <div className="loader"></div>
                </div>
              ) : null}
            </form>
          </div>

        </div>

        <button className="center button" onClick={getdata} >
        Get Files
      </button>
      <div className="image-list">{account ? data : null}</div>
      </Drawer>

<Dialog
  open={isAddressDialogOpen}
  onClose={() => setAddressDialogOpen(false)}
  maxWidth="xs"
  fullWidth
>
  <DialogTitle>User Address</DialogTitle>
  <DialogContent>
    <Typography>
      {/* Display the user's address here */}
      {getWalletAddress(selectedUser)}
    </Typography>
  </DialogContent>
  <Button onClick={() => setAddressDialogOpen(false)}>Close</Button>
</Dialog>

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
        <div className="flex space-x-4 ">
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
          className="p-3 flex fixed-bottom p-3 shadow"
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

export default Home;