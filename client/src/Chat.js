import { useState, useEffect } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

const Chat = ({ socket, username, room }) => {
	const [currentMessage, setCurrentMessage] = useState('')
	const [messageList, setMessageList] = useState([])

	const sendMessageHandler = async () => {
		if (currentMessage !== '') {
			const messageData = {
				room: room,
				author: username,
				text: currentMessage,
				time:
					new Date(Date.now()).getHours() +
					':' +
					new Date(Date.now()).getMinutes(),
			}

			await socket.emit('send_message', messageData)
			setMessageList((list) => [...list, messageData])
			setCurrentMessage('')
		}
	}

	useEffect(() => {
		socket.on('receive_message', (data) => {
			setMessageList((list) => [...list, data])
		})
	}, [socket])

	return (
		<div className="chat-window">
			<div className="chat-header">
				<p>Live chat</p>
			</div>
			<div className="chat-body">
				<ScrollToBottom className="message-container">
					{messageList.map((message) => {
						return (
							<div
								className="message"
								id={message.author === username ? 'you' : 'other'}
								key={message.text + message.time}
							>
								<div>
									<div className="message-content">
										<p>{message.text}</p>
									</div>
									<div className="message-meta">
										<p id="time">{message.time}</p>
										<p id="author">{message.author}</p>
									</div>
								</div>
							</div>
						)
					})}
				</ScrollToBottom>
			</div>

			<div className="chat-footer">
				<input
					type="text"
					placeholder="message"
					value={currentMessage}
					onChange={(e) => setCurrentMessage(e.target.value)}
					onKeyDown={(e) => {
						e.key === 'Enter' && sendMessageHandler()
					}}
				/>
				<button onClick={sendMessageHandler}>Send</button>
			</div>
		</div>
	)
}

export default Chat
