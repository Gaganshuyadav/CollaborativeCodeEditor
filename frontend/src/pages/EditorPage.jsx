import { Box, Drawer, IconButton } from "@mui/material";
import { Menu, Close} from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useRef } from "react";
import LeftSide from "../component/LeftSide";
import Editor from "../component/Editor";
import { useDispatch, useSelector} from "react-redux";
import { setAllUsers} from "../redux/features/Slices/userSlice";
import { getSocket} from "../lib/Socket.jsx";
import { CODE_SYNC, DISCONNECT, JOINED, LEAVE, SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA} from "../lib/socketEvents.jsx";
import { toast} from "react-hot-toast";

export default function EditorPage(){

    const [ openDrawer, setOpenDrawer] = useState(false);

    //use for current code
    let codeRef = useRef(`// Welcome to CodeMirror! 
// Type your code below, or paste existing code to get started.`);
    
    const dispatch = useDispatch();
    const socket = getSocket();

    const { user} = useSelector( state=>state.user);

    //function for set current data , which is send when new user jjoin
    const handleCurrentCodeForNewJoin=(code)=>{
        codeRef.current = code;
    }

    //listen for new user joined and send current editor ref for code------------------------
    const newUserJoin = ( data)=>{
        if(user.username===data.username){
            toast.success("joined");    
        }
        else{
            toast.success(`${data.username} joined the room`);
                
                //when the new user join ,we want to sync the current code to the new user editor
                socket.emit(CODE_SYNC, { socketId: data.socketId , code: codeRef.current });
        }
      
       dispatch( setAllUsers(data.allRoomUsers));

        //a single user exists in room then i get the code from thier previous work and if multiuser then i dont need to send the data , cause sync method will do it
        if(data.allRoomUsers.length < 2){
            socket.emit(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, { roomId: data.roomId , socketId: data.socketId, onlySingleUser: "single user at start"});
        }

    };

    //listen for user leave-(this message is only goes to connected users not the person who leaves currently)-----------------------
    const userLeaveGroup = ( data)=>{
        
      toast.success(`${data.username} left the room`);
      dispatch( setAllUsers(data.allRoomUsers));
    };


    //when user disconnected then disconnecting event occurs in backend

    const userDisconnected = (data)=>{
        toast.success(`${data.username} leave the room`);
        dispatch( setAllUsers(data.allRoomUsers));
    }

   




    useEffect(()=>{
    
        socket.on(JOINED, newUserJoin);
        socket.on(LEAVE, userLeaveGroup);
        socket.on(DISCONNECT, userDisconnected);

        
        return ()=>{
            socket.off(JOINED, newUserJoin);
            socket.off(LEAVE, userLeaveGroup);
            socket.off(DISCONNECT, userDisconnected);
 
        }
    },[socket]);



    return(
    
        <Grid className="editorFullPage" container={true} >

            {/* this is for devices have size md to xl -----------------------*/}
            <Grid size={{xs:0,md:3}} sx={{ backgroundColor:"rgb(45, 50, 80)",display:{xs:"none",md:"block"}}} >
                <LeftSide/>
            </Grid>

            <Grid size={{xs:12,md:9}} sx={{backgroundColor:"rgb(66, 71, 105)", overflowY:"scroll"}}>
                <Editor onCodeChangeCurrentCodeForNewJoin={handleCurrentCodeForNewJoin}/>
            </Grid>



            {/* this is for mobile phones -----------------------*/}
            <Drawer open={openDrawer} onClose={()=>{setOpenDrawer(!openDrawer)}}  sx={{display:{xs:"block",md:"none"}}}>
                <div className="drawerEditorLeftSide" style={{ width:"50vw",backgroundColor:"rgb(45, 50, 80)"}}>
                    <LeftSide/>
                </div>
            </Drawer>

            {/* icons-material */}
            {
                openDrawer
                ?
                (< Box sx={{ position:"fixed",top:"25px", right:"15px", display:{xs:"block",md:"none"}  }}>
                    <IconButton onClick={()=>{setOpenDrawer(false)}}>
                        <Close sx={{fontSize:"30px", color:"rgb(27, 233, 233)"}} />
                    </IconButton>
                </Box>)
                :
                (<Box sx={{ position:"fixed",top:"25px", right:"15px", display:{xs:"block",md:"none"}  }}>
                    <IconButton onClick={()=>{setOpenDrawer(true)}}>
                        <Menu sx={{fontSize:"30px", color:"rgb(23, 233, 233)"}} />
                    </IconButton>
                </Box>)
            }
    
            

            
        </Grid>
       
    
    )
}

//  {/* <div style={{width:"100vw", height:"100vh", border:"1px solid red", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"rgb(45, 50, 80)"}}>
//             <Box className="container" sx={{backgroundColor:"rgb(66, 71, 105)", borderRadius:"10px", width:{xs:"90%", sm:"60%",md:"50%", lg:"35%"}, padding:"17px", boxSizing:"border-box", display:"flex", flexDirection:"column",alignItems:"center", justifyContent:"center", boxShadow:"0px 0px 17px -10px black"}}>
                  
//             </Box>
//         </div> */}