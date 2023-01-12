import React, { useEffect, useState } from "react";
import { user } from "../Join/Join";
import socketIo from "socket.io-client";
import "./Chat.css";
import sendLogo from "../../images/send.png";
import Message from "../Message/Message";
import ScrollBottom from "react-scroll-to-bottom";
import closeIcon from "../../images/closeIcon.png";

let socket;
const ENDPOINT = "http://localhost:4500/";

const Chat = () => {
  const [id, setid] = useState("");
  const [messages, setMessages] = useState([]); // message which display in chat box

  const send = () => {
    // message will get by this variable and deliver
    const message = document.getElementById("chatInput").value;
    socket.emit("message", { message, id });
    document.getElementById("chatInput").value = "";
  };

  // console.log(messages);  to check message are store in term of array

  useEffect(() => {
    socket = socketIo(ENDPOINT, { transports: ["websocket"] }); // to display new connect on server

    socket.on("connect", () => {
      // to show it connect to socket
      alert(`Connected`);
      setid(socket.id);
    });

    socket.emit("joined", { user }); // data send to backend from user in term of object

    socket.on("welcome", ({ user, message, id }) => {
      setMessages([...messages, { user, message, id }]);
      console.log(user, message);
    });

    socket.on("userJoined", ({ user, message, id }) => {
      setMessages([...messages, { user, message, id }]);
      console.log(user, message);
    });

    socket.on("leave", ({ user, message, id }) => {
      setMessages([...messages, { user, message, id }]);
      console.log(user, message);
    });

    return () => {
      socket.disconnect(); // when user left
      socket.off(); // socket will off
    };
  }, []);

  useEffect(() => {
    // to send message to all users including send who has send this message
    socket.on("sendMessage", ({ user, message, id }) => {
      setMessages([...messages, { user, message, id }]);
      console.log(user, message, id);
    });

    return () => {
      socket.off(); // when message send do not rerender it
    };
  }, [messages]);

  return (
    <div className="chatPage" >
      <div className="chatContainer">
        <div className="header">
          <h2>Chat ...</h2>
          <a href="/">
            {" "}
            <img src={closeIcon} alt="Close" />{" "}
          </a>
        </div>
        <ScrollBottom className="chatBox">
          {/* <Message message={'hello'} />  for check*/}
          {messages.map((items, index) =>  (
            <Message
            key={index}
              user={items.id === id ? "" : items.user}
              message={items.message}
              classs={items.id === id ? "right" : "left"}
            />
          ))}
          {" "}
          {/* this will render the message with help of HOC */}
        </ScrollBottom>
        <div className="inputBox">
          <input
            onKeyPress={(e) => (e.key === "Enter" ? send() : null)}
            type="text"
            id="chatInput"
          />
          <button onClick={send} className="sendBtn">
            <img src={sendLogo} alt="Send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
