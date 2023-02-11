import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {

  const [input, setInput] = useState('');
  const [chatBox, setChatBox] = useState([]);
  const [userName, setUserName] = useState('');
  const [leftMessage, setLeftMessage] = useState([]);
  const [rightMessage, setRightMessage] = useState([]);


  useEffect(() => {
    const name = prompt('Enter your name to join');
    socket.emit('new-user-joined', name);
    socket.on('user-joined', name => {
      setUserName(name);
      setChatBox(oldChatBox => [...oldChatBox, { middle: name }])
    })
  }, []);

  const submit = (e) => {
    e.preventDefault();
    socket.emit('send', { message: input });
    setChatBox(oldChatBox => [...oldChatBox, { right: input }])
    setInput('');
  };

  useEffect(() => {
    socket.on('receive', (data) => {
      setChatBox(oldChatBox => [...oldChatBox, { left: `${data.name}:  ${data.message.message}` }])
    })
  }, []);

  useEffect(() => {
    socket.on('leave', user => {
      setChatBox(oldChatBox => [...oldChatBox, { leave: user }])
    })
  }, [])


  return (
    <div className="app">
      <h1>Welcome to iChat Application</h1>
      <div className="app__container">
        <div className="app__logo">
          <img src="https://img.icons8.com/ios-filled/512/chat-message.png" alt="" />
        </div>

        <div className="app__message" id='app__message'>

          {chatBox.map((data, index) =>

          // (data.left ? (<div key={index} className="app__message__container left">
          //   <p>{data.left}</p>
          // </div>) :
          //   (<div key={index} className="app__message__container right">
          //     <p>{data.right}</p>
          //   </div>))

          {
            if (data.left) {
              return (
                <div key={index} className="app__message__container left">
                  <p>{data.left}</p>
                </div>
              )
            } else if (data.right) {
              return (
                <div key={index} className="app__message__container right">
                  <p>{data.right}</p>
                </div>
              )
            } else if (data.middle) {
              return (
                <div key={index} className="app__message__container left middle">
                  <p>{data.middle} joined the chat</p>
                </div>
              )
            }
            else if (data.leave) {
              return (
                <div key={index} className="app__message__container left middle">
                  <p>{data.leave} left the chat</p>
                </div>
              )
            }
          }

          )}

        </div>

        <div className="app__form">
          <form id='inputForm' onSubmit={submit}>
            <input value={input} onChange={(e) => setInput(e.target.value)} id='inputMessage' type="text" />
            <button className='btn' type='submit'>Send</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;
