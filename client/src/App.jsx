import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"),[]);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [chatPage, setChatPage] = useState(false);

  function handleSubmit(e){
    e.preventDefault();
    console.log("hey");
    const messageData = {
      user:user,
      message:newMessage,
      time:new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    }
    socket.emit('send-message', messageData);
    // setMessages([...messages, messageData]);
    console.log(messageData);
    // console.log(messages)
    setNewMessage("");
  }

  useEffect(() => {
    socket.on('recieve-message', (message)=>{
      setMessages([...messages, message]);
    })
    console.log(messages);
  }, [messages, socket]);

  return (
    <div className="bg-gray-700 h-[100vh] w-[100vw] flex items-center justify-center">
      {chatPage ? (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-white text-2xl font-bold mb-4">Welcome {user} &#128293; !!!</h1>

          <div className="h-[70vh] w-[70vw] border-white-700 border-2 rounded-xl flex flex-col">
            {
              messages.map((msg,index)=>{
                return <div key={index} className={`flex rounded-md shadow-md my-5 w-fit ${user === msg.user ? "ml-auto mr-2" : "ml-2"}`}>
                  <div className="bg-green-700 flex justify-center items-center rounded-md">
                    <h3 className="font-bold text-lg px-2 text-white">{msg.user[0].toUpperCase()}</h3>
                  </div>
                  <div className="px-2 bg-white rounded-md">
                    <span className="text-sm">{msg.user}</span>
                    <h3 className="font-bold">{msg.message}</h3>
                    <h3 className="text-xs text-right">{msg.time}</h3>
                  </div>
                </div>
              })
            }
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Message ..."
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              className="rounded-lg px-[10px] py-[6px] border-black-100 border-2 mx-2 w-[40vw] mt-4"
            />
            <button
              type="submit"
              className="bg-green-600 text-white rounded-lg px-[10px] py-[6px] mx-2 "
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Enter Name ..."
            onChange={(e) => {
              setUser(e.target.value);
            }}
            className="rounded-lg px-[10px] py-[6px] border-black-100 border-2 mx-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white rounded-lg px-[10px] py-[6px] mx-2"
            onClick={() => {
              user !== "" && setChatPage(true);
            }}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
