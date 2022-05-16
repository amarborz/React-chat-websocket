import { useState } from 'react'

import './App.css'
import io from 'socket.io-client'
import Chat from './Chat'

const socket = io.connect('http://localhost:3001')

function App() {
	const [username, setUsername] = useState('')
	const [room, setRoom] = useState('')
	const [showChat, setShowChat] = useState(false)

	const joinRoomHandler = () => {
		if (username !== '' && room !== '') {
			socket.emit('join_room', room)
			setShowChat(true)
		}
	}

	return (
		<div className="App">
			{!showChat ? (
				<div className="joinChatContainer">
					<h3>Join a Chat:</h3>

					<input
						type="text"
						placeholder="Name"
						onChange={(e) => setUsername(e.target.value)}
					/>

					<input
						type="text"
						placeholder="Room ID"
						onChange={(e) => setRoom(e.target.value)}
					/>

					<button onClick={joinRoomHandler}>Join a Room</button>
				</div>
			) : (
				<Chat socket={socket} room={room} username={username} />
			)}
		</div>
	)
}

export default App
