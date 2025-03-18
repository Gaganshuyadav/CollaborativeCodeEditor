import { LinearProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box} from "@mui/material";
import zIndex from "@mui/material/styles/zIndex";
import { setResponseOutput } from "../redux/features/Slices/editorSlice";

export default function CodeRunnerOutput(){

    const dispatch = useDispatch();
    const {   responseOutput, isCodeRunLoading } = useSelector(state=>state.editor);

    //output resizer
    const refTop = useRef(null);
    const refOutputBox = useRef(null);

    useEffect(()=>{

        const OutputBox = refOutputBox.current;
        let styles = OutputBox.style;
        let height = parseInt(styles.height);
        let y=0;
        

//-------------------------this events is for laptop or computers
        const onMouseMoveTopResize = (e)=>{

            let dy = e.clientY - y;
            height = height - dy;
            y = e.clientY;

            if( height > 79 && e.screenY>300){
                OutputBox.style.height = `${height}px`;
            }
            

        }

        const onMouseUpTopResize = (e)=>{
            document.removeEventListener("mousemove", onMouseMoveTopResize);
        }

        const onMouseDownTopResize = (e)=>{

        y = e.clientY;

        document.addEventListener("mousemove", onMouseMoveTopResize);
        document.addEventListener("mouseup", onMouseUpTopResize);

        }


        //-------------------------this event made for phone touch events 
        const onTouchMoveTopResize = (e)=>{
            let dy = e.changedTouches[0].clientY - y;
            height = height - dy;
            y = e.changedTouches[0].clientY;

            if( height > 90 && e.changedTouches[0].screenY>300 && height < 400){
                OutputBox.style.height = `${height}px`;
            }
            

        }

        const onTouchEndTopResize = (e)=>{
            document.removeEventListener("touchmove", onTouchMoveTopResize);
        }

        const onTouchStartTopResize = (e)=>{

        y = e.changedTouches[0].clientY;

        document.addEventListener("touchmove", onTouchMoveTopResize);
        document.addEventListener("touchend", onTouchEndTopResize);

        }

        //-----touch event 
        const resizeTop = refTop.current;
        resizeTop.addEventListener("mousedown", onMouseDownTopResize);
        resizeTop.addEventListener( "touchstart", onTouchStartTopResize);


        return ()=>{
            resizeTop.removeEventListener("mousedown", onMouseDownTopResize);
            resizeTop.removeEventListener( "touchstart", onTouchStartTopResize);

            document.removeEventListener("mouseup", onMouseUpTopResize);
            document.removeEventListener("touchend", onTouchEndTopResize);
        }

    },[]);


    return(
        <div ref ={refOutputBox} style={{ position:"absolute", bottom:"0px", width:"100%", height:"210px", color:"white", background:"rgb(66, 71, 105)", zIndex:"2", overflowY:"scroll"}}>
            {/* resizer stick */}
            <div ref={refTop} className="output-resizer"></div>
            {/* clear output */}
            <Box className="bin-icon" onClick={()=>{ dispatch( setResponseOutput(""))}}>
                <DeleteIcon sx={{fontSize:"24px"}} />
                <Typography>Clear</Typography>
            </Box>
            {/* output shower */}
            <div style={{ width:"100%", height:"100%", position:"relative", top:"0px"}}>
            {
                isCodeRunLoading
                ?
                (<div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", width:"100%",height:"100%", position:"relative"}}>
                    <LinearProgress  sx={{
                                          height:"5px", 
                                          position:"relative",
                                          backgroundColor:"rgb(239, 236, 236)" ,
                                          '& .MuiLinearProgress-bar':{
                                              backgroundColor: "rgb(31, 156, 150)",
                                          }
                                        }}/>
                    <LinearProgress  sx={{
                                          height:"6px", 
                                          position:"relative",
                                          bottom:"10px",
                                          backgroundColor:"rgb(239, 236, 236)" ,
                                          '& .MuiLinearProgress-bar':{
                                              backgroundColor: "rgb(31, 156, 150)",
                                          }
                                      }}/>
                </div>)
                :
                (<div style={{ padding:"25px 20px", boxSizing:"border-box"}}>
                {
                    responseOutput
                    ?
                    (<>
                    {
                        responseOutput?.run?.stderr===""
                        ?
                        (<div className="output">
                            <Typography sx={{whiteSpace:"pre-wrap", boxSizing:"border-box"}}>{responseOutput?.run?.output}</Typography>
                            <Typography sx={{marginTop:"25px"}}>=== Code Execution Successful ===</Typography> 
                        </div>)
                        :
                        (<div className="error">
                            <Typography sx={{whiteSpace:"pre-wrap", color:"rgb(250, 93, 93)"}}>{responseOutput?.run?.output}</Typography>
                            <Typography sx={{marginTop:"25px"}}>=== Code Exited With Errors ===</Typography>
                        </div>)
                    }
                    </>)
                    :
                    (<div>
                        <Typography>=== Code Outputs !! ===</Typography>
                    </div>)
                    
                }
            </div>)
            }
            </div>
            
        </div>
    )
}