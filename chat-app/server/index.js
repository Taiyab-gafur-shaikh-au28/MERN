const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500 || process.env.PORT;      // it will run on this port if not found available port will take   

const users = [{}];

app.use(cors());                        // it is used to tackle CORS errors in a Node.js application. 
app.get("/", (req, res) => {
    res.send(`It's Working`)
})

const server = http.createServer(app);      // server create & express call by http (to enable communications between clients and servers)

const io = socketIO(server);        // on connection created

io.on("connection", (socket) => {            // connection on then this message will display
    console.log(`New Connection`);

    socket.on('joined', ({ user }) => {        // data receive from front end 
        users[socket.id] = user;                // every user have unique id while joint
        console.log(`${user} has joined`);

        socket.broadcast.emit('userJoined', { user: 'Admin', message: ` ${users[socket.id]} has joined` }); 
        // this message will display to all who are chatting when new user joint 

        socket.emit('welcome', { user: 'Admin', message: `Welcome to the chat , ${users[socket.id]}` }); 
        // while joint chat this message will display
    })

    socket.on('message' , ({message , id}) => {
        io.emit('sendMessage' , {user : users[id] , message , id})
    })

    socket.on('disconnect' , () =>{         // when user left
        socket.broadcast.emit('leave', { user: 'Admin', message: ` ${users[socket.id]} has left` });
        console.log(`User Left`);
    })


})





server.listen(port, () => {
    console.log(`Server is Working on http://localhost:${port}`)
})



