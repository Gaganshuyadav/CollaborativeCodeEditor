import { LinearProgress, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

export default function CodeRunnerOutput(){

    const dispatch = useDispatch();
    const {   responseOutput, isCodeRunLoading } = useSelector(state=>state.editor);
    console.log(responseOutput);
    
      
    return(
        <div style={{ position:"absolute", bottom:"0px", width:"100%", height:"30%", color:"white", background:"rgb(66, 71, 105)"}}>
            {
                isCodeRunLoading
                ?
                (<div style={{border:"1px solid red",display:"flex", flexDirection:"column", justifyContent:"space-between", width:"100%",height:"100%"}}>
                    <LinearProgress  sx={{
                                          height:"5px", 
                                          backgroundColor:"rgb(239, 236, 236)" ,
                                          '& .MuiLinearProgress-bar':{
                                              backgroundColor: "rgb(31, 156, 150)",
                                          }
                                        }}/>
                    <LinearProgress  sx={{
                                          height:"6px", 
                                          backgroundColor:"rgb(239, 236, 236)" ,
                                          '& .MuiLinearProgress-bar':{
                                              backgroundColor: "rgb(31, 156, 150)",
                                          }
                                      }}/>
                </div>)
                :
                (<div style={{border:"1px solid red"}}>
                    {
                        responseOutput?.run?.stderr===""
                        ?
                        (<div className="output">
                            <Typography>{responseOutput?.run?.output}</Typography>
                            <Typography>=== Code Execution Successful ===</Typography> 
                        </div>)
                        :
                        (<div>
                            <Typography>{responseOutput?.run?.output}</Typography>
                            <Typography>=== Code Exited With Errors ===</Typography>
                        </div>)
                    }
                    
                    
                    
                </div>)
            }
            <div>

            </div>

        </div>
    )
}