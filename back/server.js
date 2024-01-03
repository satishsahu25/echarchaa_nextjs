require("dotenv").config();
const express = require("express");
const router = require("./routes/routes");
const cors = require("cors");
const DBconnect = require("./db");
const app = express();
const port = process.env.PORT || 5000;
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ACTIONS = require("./actions");
const server = require("http").createServer(app);

const socketIo = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json({ limit: "20mb" }));
app.use("/storage", express.static("storage"));

app.use("/api", router);

//SOCKET LOGIC------------------------------------

const socketUserMapping = {};

socketIo.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
    socketUserMapping[socket.id] = user;

    //Map to array
    const clientsinRoom = Array.from(
      socketIo.sockets.adapter.rooms.get(roomId) || []
    );

    clientsinRoom.forEach((clientId) => {
      socketIo.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      //Emitting to other users in clientsinRoom
      socketIo.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });

    socketIo.join(roomId);
  });


    //Handle relay ice
    socketIo.on(ACTIONS.ICE_CANDIDATE,({peerId,icecandidate}) =>{

      socketIo.to(peerId).emit(ACTIONS.RELAY_ICE,{peerId:socket.id,icecandidate});

    });



    //handle relay sdp(session description)

    socket.on(ACTIONS.SESSION_DESCRIPTION,({peerId,sessionDescription})=>{
      socketIo.to(peerId).emit(ACTIONS.RELAY_SDP,{
        peerId:socket.id,
        sessionDescription
      })    })




      //Handle leaving the room
      const leaveRoom=({roomId})=>{
        const {rooms}=socket;
        Array.from(rooms).forEach(roomId=>{
          const clients=Array.from(socketIo.adapter.rooms.get(roomId)) || [];
        });

        clients.forEach(clientId=>{
          //baki sabko ko nikalana
          socketIo.to(clientId).emit(ACTIONS.REMOVE_PEER,{
            peerId,
            userId:socketUserMapping[socket.id]?.id
          });

          //khud ko nikalna
          socketIo.emit(ACTIONS.REMOVE_PEER,{
            peerId:clientId,
            userId:socketUserMapping[clientId]?.id
          });
          socket.leave(roomId);
        });
        

        delete socketUserMapping[socket.id];

       

      }
      socket.on(ACTIONS.LEAVE,leaveRoom);


      //inbuilt event in socket
      socket.on('disconnecting',leaveRoom);



});

server.listen(port, () => {
  DBconnect();
  console.log(`listening on ${port}`);
});
