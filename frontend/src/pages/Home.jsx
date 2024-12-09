import { Box, Button, Typography} from "@mui/material";
import SiteLogo from "/images/firstLogo.png";
import { useState, useEffect} from "react";
import { v4 as uuid} from "uuid";
import { useNavigate} from "react-router-dom";
import { toast} from "react-hot-toast";
import { useDispatch} from "react-redux";
import { setCurrentUser } from "../redux/features/Slices/userSlice";
import { server } from "../utils/config";
import axios from "axios";
import { CircularProgress} from "@mui/material";

export default function Home(){

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [ roomId, setRoomId] = useState("");
  const [ username, setUsername] = useState("");
  const [ loading, setIsLoading] = useState(false);


  const handleNewRoomCreate=()=>{
    const newId = uuid();
    setRoomId(newId);
    toast.success("Created a new room");
    
  }

  const handleJoinRoom = ()=>{
    if(!roomId.trim()){
      toast.error("room ID is required");
      return;
    }
    if(!username.trim()){
      toast.error("username is required");
      return;
    }

    dispatch( setCurrentUser({ username, roomId}))
    navigate(`/editor/${roomId}`);
  }

  const handleEnterJoinEvent = (e)=>{
      if(e.key==="Enter"){
        handleJoinRoom();
      }
  }

  useEffect(()=>{
       async function backendCheck(){
        setIsLoading(true);
           const res = await axios.get(server);
           console.log(res);
           setIsLoading(false);
           
       }
       backendCheck();
  },[]);

    return(
        <div style={{width:"100vw", height:"100vh", display:"flex", justifyContent:"center", alignItems:"center", backgroundColor:"rgb(45, 50, 80)"}}>
          {
            loading
            ?
            <CircularProgress/>
            :
            (<Box className="container" sx={{backgroundColor:"rgb(66, 71, 105)", borderRadius:"10px", width:{xs:"90%", sm:"60%",md:"50%", lg:"35%"}, padding:"17px", boxSizing:"border-box", display:"flex", flexDirection:"column",alignItems:"center", justifyContent:"center", boxShadow:"0px 0px 17px -10px black"}}>
                  
                  <div className="logo"  style={{ alignSelf:"start", width:"300px", height:"84px", marginTop:"8px"}}>
                      <img src={SiteLogo} style={{width:"84px", marginLeft:"30px"}}/>
                  </div>
                  
                  <Typography sx={{alignSelf:"start", color:"white", fontSize:"14px",letterSpacing:"1px",marginTop:"20px", marginLeft:"10px"}}>Paste invitation ROOM ID</Typography>
                  
                  <input type="text" value={roomId} onChange={( e)=>{setRoomId(e.target.value)}} placeholder="ROOM ID" spellCheck={false} onKeyUp={handleEnterJoinEvent} style={{ marginTop:"12px",width:"100%",height:"50px",borderRadius:"10px",fontSize:"18px",padding:"0 30px 0 30px",boxSizing:"border-box", border:"none", fontWeight:"600",letterSpacing:"0.5px"}}/>
                  
                  <input type="text" value={username} onChange={(e)=>{ setUsername(e.target.value)}} placeholder="USERNAME" spellCheck={false} onKeyUp={handleEnterJoinEvent} style={{ marginTop:"18px",width:"100%",height:"50px",borderRadius:"10px",fontSize:"18px",padding:"0 30px 0 30px",boxSizing:"border-box", border:"none", fontWeight:"600",letterSpacing:"0.5px"}}/>
                  
                  <Button className="joinButton" onClick={ handleJoinRoom} sx={{alignSelf:"end", backgroundColor:"rgb(0, 255, 156)", color:"green", fontWeight:"600", letterSpacing:"1px",borderRadius:"10px", padding:"7px 24px",fontSize:"17px", marginTop:"13px", "&:hover":{backgroundColor:"rgb(182, 255, 161)"}}}>Join</Button>

                  <Typography sx={{ marginTop:"17px", color:"white",fontSize:"14px",letterSpacing:"1px", width:"100%", textAlign:"center",padding:{xs:"0 20px 0 20px",md:"0px", boxSizing:"border-box"}}}>
                    If you don't have an invite then create 
                    <span className="newIDMaker" onClick={handleNewRoomCreate}>new room</span>
                  </Typography>

            </Box>)
          }
        </div>
    )
}