import { Typography } from "@mui/material";
import { randomColor} from "randomcolor";
import { useSelector } from "react-redux";


export default function UsersPage(){

    const { allUsers} = useSelector( state=>state.user);
    
    return(
        <>
        <Typography sx={{color:"gray", marginTop:"10px",marginLeft:"15px"}}>Connected Users</Typography>
        <div style={{ width:"100%", height:"93%",overflowY:"scroll", display:"flex", flexDirection:"column"}}>
            {
                allUsers?.map((user,i)=>{
                    return(
                        <div key={i} style={{ display:"flex", alignItems:"start", justifyContent:"start", flexDirection:"row", width:"100%", }}>
                            <div style={{ display:"flex",alignItems:"center", justifyContent:"center", color:"white", margin:"10px 4px"}}> 
                                <div style={{ width:"52px", height:"52px", borderRadius:"28%", backgroundColor: randomColor(), display:"flex", alignItems:'center', justifyContent:"center", marginLeft:"10px"}}>
                                    <Typography sx={{fontSize:"25px", textShadow:"0px 0px 10px black"}}>{user.name.split(" ").length<2 ? user.name.split(" ")[0].slice(0,1).toUpperCase() : `${user.name.split(" ")[0].slice(0,1).toUpperCase() + user.name.split(" ")[1].slice(0,1).toUpperCase()}` }</Typography>
                                </div>
                                <Typography sx={{marginLeft:"10px",letterSpacing:"0.5px"}}>{user.name}</Typography>
                            </div>
                        </div>
                    )
                })  
            }
        </div>
        </>
    )
}