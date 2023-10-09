import React, { useEffect, useState, useRef } from 'react';
import Peer from "simple-peer";
import styled from "styled-components";
import global from 'global'
import * as process from "process";
global.process = process;
import { useSocket } from '../contexts/SocketContext';


const Container = styled.div`
  height: 100vh;
  width: 100%;
  flex-direction: column;
`;

const Row = styled.div`
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
`;

function NewVideo(props) {
    console.log("myyyyyyyyyy",props.mySocketId)
console.log("oooooooooppppppppppp0000",props.opponentSocketId)
  const socket = useSocket();
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false)
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    })
  }, []);

  function callPeer(id) {
    setIsCalling(true)
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", data => {
      socket.emit("callUser", { userToCall: id, signalData: data, from: props.mySocketId})
    })

    peer.on("stream", stream => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", signal => {
      setCallAccepted(true);
      peer.signal(signal);
    })

  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", data => {
      socket.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

 
  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video
        playsInline
        muted
        ref={userVideo}
        autoPlay
        className="w-1/2 h-1/2" // 50% width and height
      />
    );
  }
  
  let mainView;
  
  if (callAccepted) {
    mainView = (
      <Video
        playsInline
        ref={partnerVideo}
        autoPlay
        className="w-full h-full" // 100% width and height
      />
    );
  } else if (receivingCall) {
    mainView = (
      <div>
        <h1 className="text-black">
          {props.opponentUserName} is calling you
        </h1>
        <button
          onClick={acceptCall}
          className="text-black border border-black"
        >
          <h1>Accept</h1>
        </button>
      </div>
    );
  } else if (isCalling) {
    mainView = (
      <div>
        <h1 className="text-black">
          Currently calling {props.opponentUserName}...
        </h1>
      </div>
    );
  } else {
    mainView = (
      <button
        onClick={() => {
          callPeer(props.opponentSocketId);
        }}
        className="border border-black text-black"
      >
        <h1>Chat with your friend while you play!</h1>
      </button>
    );
  }
  

  // return (<Container>
  //     <Row>
  //       {mainView}
  //       {UserVideo}
  //     </Row>
  //   </Container>);
  return (
    <Container>
      <Row>
       
        <div className="w-full h-full">{mainView}</div>
  
        
        <div className="w-1/2 h-1/2">{UserVideo}</div>
      </Row>
    </Container>
  );
  
}

export default NewVideo;

// import React, { useEffect, useState, useRef } from "react";
// import { useSocket } from "@/contexts/SocketContext";
// import Peer from "peerjs";
// import { useRouter } from "next/router";
// import { useUser } from "@/contexts/UserContext";
// export default function VideoFrame() {
//   const router = useRouter();
//   const { username, id } = useUser();
//   const socket = useSocket();
//   const [videos, setVideos] = useState([]);
//   const vidRef = useRef();
//   const vidRef2 = useRef();
//   const { gameId } = router.query;
//   useEffect(() => {
//     // Check if the code is running in a browser environment
//     if (typeof navigator !== "undefined" && navigator.mediaDevices) {
//       const myPeer = new Peer();
//       console.log("effect");

//       navigator.mediaDevices
//         .getUserMedia({ video: { height: 300, width: 300 } })
//         .then((stream) => {
//           window.localStream = stream;
//           document.getElementById("myVideo").srcObject = stream;

//           myPeer.on("call", (call) => {
//             call.answer(stream);
//             call.on("stream", (userStream) => {
//               console.log(vidRef);
//               let vv = (
//                 <video
//                   src=""
//                   key={Math.random() * 100}
//                   autoPlay={true}
//                   ref={vidRef}
//                 ></video>
//               );
//               setVideos([...videos, vv]);
//               vidRef.current.srcObject = userStream;

//               console.log(videos);
//             });
//           });
//           socket.on("user-joined-meeting", (username) => {
//             const call = myPeer.call(username, stream);
//             call.on("stream", (userStream) => {
//               setVideos([
//                 ...videos,
//                 <video
//                   key={Math.random() * 100}
//                   autoPlay={true}
//                   ref={vidRef2}
//                 ></video>,
//               ]);

//               vidRef2.current.srcObject = userStream;
//               console.log(videos);
//             });
//           });
//         });

//       myPeer.on("open", (id) => {
//         socket.emit("meeting", gameId, username);
//         console.log("open");
//       });
//     }
//   }, []);

//   return (
//     <div className="videoCallContainer">
//       <video src="" autoPlay={true} muted={true} id="myVideo"></video>
//       {videos}
//     </div>
//   );
// }
