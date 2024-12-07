import express from "express";
import { createServer} from "http";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { Server} from "socket.io";
import { CODE_CHANGE, CODE_SYNC, DISCONNECT, JOIN, JOINED, LEAVE} from "./constants/events.js";
import { getAllRoomUsers, getSocketIdsForEachUserBasedOnRoomId } from "./lib/helper.js";
dotenv.config();


const server = createServer(app);
const io = new Server(server,{ 
    cors: {
        origin:"*",
    },
});



app.use(cors());

app.get("/",(req,res)=>{
    
    res.json({
        message:"hello",
        success:true,
    })
})

const allUsers = new Map();

// socket connection-------
io.on("connection", ( socket)=>{

    //(1). new user join new room
    socket.on(JOIN, ( { name, roomId})=>{
        
        //join room
        socket.join(roomId);

        //set new user
        allUsers.set( socket.id , { name, roomId});

        //get all users id from room
        const roomAllIds = getSocketIdsForEachUserBasedOnRoomId(socket,roomId);

        //get all users information from map using roomAllIds
        const allRoomUsers = getAllRoomUsers( allUsers, roomAllIds); 

        //notify others , for new user and set values for new user
        io.to(roomAllIds).emit(JOINED, { allRoomUsers, username: name, socketId: socket.id });

    });

    //(2). leave the room
    socket.on(LEAVE, ({ name, roomId})=>{

        //leave room
        socket.leave(roomId);

        //delete user from set
        allUsers.delete(socket.id);

        //get all users id from room
        const roomAllIds = getSocketIdsForEachUserBasedOnRoomId(socket, roomId);

         //get all users information from map using roomAllIds
         const allRoomUsers = getAllRoomUsers( allUsers, roomAllIds);


        io.to(roomAllIds).emit(LEAVE, { allRoomUsers, username: name, socketId: socket.id});


    })


    //(3). user disconnected or close the tab
    socket.on("disconnecting", (data)=>{

        //find user data
        const userData = allUsers.get(socket.id);

        //delete user from allUsers set
        allUsers.delete(socket.id);

        if(userData?.roomId){

            //find all users id from that room
            const roomAllIds = getSocketIdsForEachUserBasedOnRoomId(socket, userData.roomId);

            //get all users information from map using roomAllIds
            const allRoomUsers = getAllRoomUsers( allUsers, roomAllIds);

       
            //notify others when user disconnect or close the tab
            io.to(userData.roomId).emit(DISCONNECT, { allRoomUsers, username: userData.name, socketId: socket.id});

         }
    })

    //(4). code is changing when user writes
    socket.on(CODE_CHANGE, ({ name, roomId, code})=>{

        //this means that the event occurs to everyone in the room without the current user
        socket.in(roomId).emit(CODE_CHANGE, { username: name, socketId: socket.id, roomId, code});

    })

    //(5). code sync , when new user join
    socket.on(CODE_SYNC, ( data)=>{

        if(data.code && data.socketId){
            socket.to(data.socketId).emit(CODE_SYNC, { senderSocketId: socket.id , code: data.code, socketId: data.socketId})
        }
        
    })



    

    socket.on("disconnect",()=>{

        //disconnected
        // console.log("disconnected");
        
    })
});






//listen 
const PORT =  process.env.PORT || 3000;
server.listen( PORT, ()=>{
    console.log(`server is running on PORT ${PORT}`);
})

