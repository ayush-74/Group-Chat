const express=require("express");
const app=express();
const {createServer} = require('http');
const server = createServer(app);
const {Server} = require("socket.io");

const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true
    }
});
const cors = require('cors');

app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials:true
}));

io.on('connection', (socket) => {
    console.log('user connected ', socket.id);
    socket.on('send-message', (message)=>{
        io.emit('recieve-message', message);
    })

    socket.on('disconnect', ()=>{
        console.log("user disconnected");
    })
});

app.get("/",(req,res)=>{
    res.send("Hello");
})

server.listen(3000,()=>{
    console.log("Server Started at 3000");
})
