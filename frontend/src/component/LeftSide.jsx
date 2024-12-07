import SiteLogo from "/images/secondLogo.png";
import UsersPage from "./UsersPage";
import { Box } from "@mui/material";
import  { useParams, useNavigate} from "react-router-dom";
import { useSelector, useDispatch} from "react-redux";
import { setIsLeaveGroup } from "../redux/features/Slices/componentSlice";
import { toast} from "react-hot-toast";
import LeaveGroupDialog from "./Dialogs/LeaveGroupDialog";
import { LEAVE } from "../lib/socketEvents";
import { getSocket } from "../lib/Socket";


export default function LeftSide(){

    const params = useParams();
    const socket = getSocket();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isLeaveGroup} = useSelector(state=>state.component);
    const { user} = useSelector(state=>state.user);

    //copy room id
    const handleCopyRoomId = async ()=>{
        try{
            await window.navigator.clipboard.writeText(params.id);
            toast.success("Room ID copied")
        }
        catch(err){
            console.log(err);
            toast.error("Could not copy the Room ID");
        }
        
    }

    //handle Leave Group
    const handleLeaveGroup = ()=>{
        if(!user.username || !user.roomId) return; 
        dispatch(setIsLeaveGroup(false));
        socket.emit(LEAVE, { name: user.username, roomId: user.roomId});
        navigate("/");
    };

    return(
        <>
        {/* logo */}
        <div className="logo"  style={{ alignSelf:"start", width:"300px", height:"84px", marginTop:"8px"}}>
            <img src={SiteLogo} style={{width:"84px", marginLeft:"30px"}}/>
        </div>

        {/* users list */}
        <Box sx={{width:"100%", height:"70vh"}}>
            <UsersPage/>
        </Box>

        {/* buttons */}
        <div style={{width:"100%",height:"100px", display:"flex", flexDirection:"column", justifyContent:"center",alignItems:"center"}}>
            <button className="copyRoomId" onClick={handleCopyRoomId}>Copy ROOM ID</button>
            <button className="leave" onClick={()=>{ dispatch( setIsLeaveGroup(true))}} disabled={isLeaveGroup}>Leave</button>
        </div>
    

        {/* dialogs */}
        <LeaveGroupDialog handler={handleLeaveGroup} />
        </>
    )
}


