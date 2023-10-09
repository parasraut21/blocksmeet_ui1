import React, { useEffect } from 'react';
import Loader from './Loader';
import { useSocket } from '../contexts/SocketContext';
import { useUser } from '../contexts/UserContext';
import { useGame } from '../contexts/MeetsContext';

import Home from './Home';

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Ensure it takes up at least the viewport height
  margin: '0',
  padding: '0',
};

// Define the copyToClipboard function
function copyToClipboard(text) {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
}

export default function Game({ gameId }) {
  const { game, players } = useGame();
  const socket = useSocket();
  const { id, username } = useUser();

  useEffect(() => {
    if (!socket) return;
    socket.emit('join game', gameId, username ? username : 'Guest');
  }, [socket, gameId, username]);

  return !game ? (
    <div style={containerStyle}>
      <Loader color="#fff" size="70px" />
    </div>
  ) : players.length >= 1 ? (
    <div>
      <Home/>
    </div>
  ) : (
    <div style={containerStyle}>
      <div>
        <h1 style={{ marginBottom: '1em' }}>Waiting for opponent...</h1>
        <button  className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={() => copyToClipboard(window.location.href)}>Copy URL to clipboard</button>
      </div>
    </div>
  );
}
