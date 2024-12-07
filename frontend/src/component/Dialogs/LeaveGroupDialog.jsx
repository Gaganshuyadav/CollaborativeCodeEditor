import { Dialog, DialogTitle, Typography, Box, DialogContent, Button } from "@mui/material";
import { setIsLeaveGroup } from "../../redux/features/Slices/componentSlice";
import { useSelector, useDispatch } from "react-redux";

export default function LeaveGroupDialog( {handler}){

    const dispatch = useDispatch();
    const { isLeaveGroup} = useSelector(state=>state.component);

    return(
        <>
        <Dialog open={isLeaveGroup} onClose={()=>{ dispatch(setIsLeaveGroup(false))}} PaperProps={{ style:{ backgroundColor:"rgb(40, 45, 74)", borderRadius:"10px"}}} >
            <Box sx={{padding:"10px 23px", backgroundColor:"rgb(40, 45, 74)", color: "rgb(19, 220, 185)",borderRadius:"10px" }}>
              <DialogTitle sx={{ backgroundColor:"rgb(40, 45, 74)", color: "rgb(19, 220, 185)" }} >Leave the Group</DialogTitle>
              <DialogContent sx={{ backgroundColor:"rgb(40, 45, 74)", color: "rgb(19, 220, 185)" }}>Are you sure you want to leave the group</DialogContent>
              <Box sx={{ justifyContent:"space-around", display:"flex", margin:"5px 10px 20px 10px"}}>
                <Button onClick={ handler} sx={{border:"2px solid rgb(19, 220, 185)", padding:"0px 25px", textTransform:"capitalize", fontSize:"17px", color:"rgb(19, 220, 185)", backgroundColor: "rgb(49 55 87)", heihgt:"40px", "&:hover":{backgroundColor:"rgb(19, 220, 185)", color:"rgb(49 55 87)"}}}>
                    Leave
                </Button>
                <Button onClick={()=>{ dispatch( setIsLeaveGroup(false)) }} sx={{border:"2px solid rgb(19, 220, 185)", padding:"0px 25px", textTransform:"capitalize", fontSize:"17px", color:"rgb(19, 220, 185)", backgroundColor: "rgb(49 55 87)",height:"40px", "&:hover":{backgroundColor:"rgb(19, 220, 185)", color:"rgb(49 55 87)"}}}>
                    Cancel
                </Button>
              </Box>
            </Box>
        </Dialog>
        </>
    )
}