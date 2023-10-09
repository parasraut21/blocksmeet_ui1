import React, { useState, useEffect } from 'react'

import Game from './MeetWait'


import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/SocketContext'
import { useGame } from '../contexts/MeetsContext'
import { useUser } from '../contexts/UserContext'



export default function GamePage() {
  const socket = useSocket()
  const [popup, setPopup] = useState()
  const { gameId } = useParams()
  const navigate = useNavigate()

  const { gameOver, orientation, initGame, players } = useGame()
  const { username } = useUser()
  const [isRematch, setIsRematch] = useState(0)

  useEffect(() => {
    if(!orientation) return
    if(gameOver != null) {
      let message = gameOver.winner != null ? ((gameOver.winner === 0 && orientation === 'white' || gameOver.winner === 1 && orientation === 'black') ? 'You Win!' : (gameOver.winner === 0 ? 'white' : 'black') + ' wins') : 'Draw'
      setPopup({
        message,
        extra: 'by ' + gameOver.reason,
        element: <button onClick={() => socket.emit('rematch', gameId)}>Rematch</button>
      })
      setIsRematch(0)
    }else {
      setPopup(null)
    }
  }, [gameOver, orientation])

  useEffect(() => {
    if(!socket) return
    return () => socket.emit('leave')
  }, [socket])

  useEffect(() => {
    if(!socket) return
    socket.on('leave', () => {
      navigate('/')
    })
    socket.on('player left', () => {
      setPopup({
        message: "Your oppenent left.",
        extra: "they may return..."
      })
    })
    socket.on('rematch', () => {
      setIsRematch(1)
    })
  }, [socket])


  return (
    <div className='game-container'>
      <div className='board-container'>
        <Game gameId={gameId} />
      </div>
    </div>
  )
}