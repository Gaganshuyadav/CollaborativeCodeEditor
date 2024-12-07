
import { useState, useEffect, useRef} from "react";
//codemirror setup----------
import CodeMirrorArea from "@uiw/react-codemirror";
import { solarizedDark} from "@uiw/codemirror-theme-solarized";
import { javascript} from "@codemirror/lang-javascript";
import { getSocket } from "../lib/Socket";
import { CODE_CHANGE, CODE_SYNC, JOIN } from "../lib/socketEvents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

//------------------------

export default function Editor({ onCodeChangeCurrentCodeForNewJoin}){


    const socket = getSocket();
    const { user} = useSelector(state=>state.user);
    const navigate = useNavigate();
    const [ code, setCode] = useState(`// Welcome to CodeMirror! 
// Type your code below, or paste existing code to get started.`);
    
    //initialise or send data to the socket when new user comes( notify others)
    useEffect(()=>{
        if( user.username && user.roomId){
            socket.emit(JOIN , { name: user.username, roomId: user.roomId});
        }
        else{
            navigate("/");
        }
        
    },[]);


    //code change
    const codeChange = ( text, e )=>{
        setCode(text);
        socket.emit(CODE_CHANGE, { name: user.username, roomId: user.roomId, code: text});
    
         //i want current code ref for the user who joins right now
            onCodeChangeCurrentCodeForNewJoin(text);
    
    };


    //code sync when new user join the room
    const codeSyncWhenNewUserJoin = (data)=>{
        if(data.code){
            setCode(data.code);
        }
        
    };

    

    //when socket members type code-----------------
    const codeChangingByOther = (data) =>{
        
        if(data.code===`// Welcome to CodeMirror! 
            // Type your code below, or paste existing code to get started.`){
                return;
            }
        if(null===data.code){
            return;
        }
        
        setCode(data.code);
    };

    useEffect(()=>{

        socket.on(CODE_CHANGE, codeChangingByOther);
        socket.on(CODE_SYNC, codeSyncWhenNewUserJoin);

        return ()=>{
            socket.off(CODE_CHANGE, codeChangingByOther);
            socket.off(CODE_SYNC, codeSyncWhenNewUserJoin);
        }
    },[socket]);




    return(
        <CodeMirrorArea onChange={codeChange} value={code} theme={solarizedDark} className="editorArea" height="100vh" extensions={ javascript()} >
        </CodeMirrorArea>
    )
}