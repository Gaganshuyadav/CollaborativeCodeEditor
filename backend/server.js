import express from "express";
import { createServer} from "http";
const app = express();
import dotenv from "dotenv";
import cors from "cors";
import { Server} from "socket.io";
import { CHECK_ROOM_FOR_SAME_NAME, CODE_CHANGE, CODE_SYNC, DISCONNECT, JOIN, JOINED, LEAVE, SELECT_DIFFERENT_LANGUAGE, SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA} from "./constants/events.js";
import { getAllRoomUsers, getSocketIdsForEachUserBasedOnRoomId } from "./lib/helper.js";
dotenv.config();


const server = createServer(app);
const io = new Server(server,{ 
    cors: {
        origin:"*",
    },
});

//database connection



import { connectionDB} from "./configDB.js";
connectionDB(process.env.URI);

// import { User} from "./models/user.js";
import { Code} from "./models/code.js";



app.use(cors());

app.get("/",(req,res)=>{
    
    res.json({
        message:"hello",
        success:true,
    })
})



const allUsers = new Map();   //keys are socketId of individual User
// const codeList = new Map();   //keys are roomId

// socket connection-------
io.on("connection", ( socket)=>{

    //(1). new user join new room
    socket.on(JOIN, async ( { name, roomId})=>{
        
        //join room
        socket.join(roomId);

        //set new user
        allUsers.set( socket.id , { name, roomId});

        

        //get all users id from room
        const roomAllIds = getSocketIdsForEachUserBasedOnRoomId(socket,roomId);

        //get all users information from map using roomAllIds
        const allRoomUsers = getAllRoomUsers( allUsers, roomAllIds); 
    
            
        //notify others , for new user and set values for new user
        io.to(roomAllIds).emit(JOINED, { allRoomUsers, username: name, socketId: socket.id, roomId });
        

    });

     //(2). new user join new room
     socket.on( CHECK_ROOM_FOR_SAME_NAME, ( { username, roomId})=>{
    
        //get socket ids for each user 
        const allUsersSocketIds =  getSocketIdsForEachUserBasedOnRoomId( socket, roomId);

        if(allUsersSocketIds.length < 1){
            socket.emit(CHECK_ROOM_FOR_SAME_NAME, { nameAllowed: true});
        }
        else{

            //get users details from socket id
            const allRoomUsers = getAllRoomUsers( allUsers, allUsersSocketIds)
            
            const findUser = allRoomUsers.find((user)=>{
                return user.name===username;
            })

            if(findUser===undefined){
                socket.emit(CHECK_ROOM_FOR_SAME_NAME, { nameAllowed: true});
            }
            else{
                socket.emit(CHECK_ROOM_FOR_SAME_NAME, { nameAllowed: false});
            }
        }

     })


    //(3). leave the room
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


    //(4). user disconnected o`r close the tab
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

    //(5). code is changing when user writes
    socket.on(CODE_CHANGE,  async({ name, roomId, code, selectedLanguage})=>{

        //when users writing the code we set code in maps
        // codeList.set(roomId,{code, selectedLanguage});

        const findOne = await Code.findOne({ roomId});

        if(findOne!==null){
            const find = await Code.findOneAndUpdate({ roomId},{ code, selectedLanguage});

        }
        else{
            const codeCreate = await Code.create({ 
                code,
                selectedLanguage,
                roomId
            });

        }


        //this means that the event occurs to everyone in the room without the current user
        // socket.in(roomId).emit(CODE_CHANGE, { username: name, socketId: socket.id, roomId, code});

    })

    //(6). code sync , when new user join
    socket.on(CODE_SYNC, ( data)=>{

        if(data.code && data.socketId){
            socket.to(data.socketId).emit(CODE_SYNC, { senderSocketId: socket.id , code: data.code, selectedLanguage: data.selectedLanguage, socketId: data.socketId})
        }
        
    })


     //(7). a single user exists in room then i get the code from thier previous work and if multiuser then i dont need to send the data , cause sync method will do it
     
     socket.on(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, async( { roomId, socketId, onlySingleUser})=>{

            // let codeData = codeList.get(roomId);
            const findCode = await Code.findOne({
                roomId
            })

            let codeData;
            if(findCode!=null){
                codeData = findCode;
            }
            else{
                codeData = null;
            }
            
        
            // io.to(roomId).emit(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, { roomId, previousStoredCode: codeData});

     });
            
    //(8). when any user change the language
    socket.on(SELECT_DIFFERENT_LANGUAGE, async ({ roomId, selectedLanguage})=>{

        //update language in database
        const updateLanguage = await Code.findOneAndUpdate({ roomId},{selectedLanguage});

        socket.in(roomId).emit(SELECT_DIFFERENT_LANGUAGE, { roomId, selectedLanguage});
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

