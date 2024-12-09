
import { useState, useEffect, useRef, version} from "react";
//codemirror setup----------
import { Box, Select, MenuItem, Typography, backdropClasses, Button } from "@mui/material";
import { Language, PlayArrow } from "@mui/icons-material";
import CodeMirrorArea from "@uiw/react-codemirror";
import { solarizedDark} from "@uiw/codemirror-theme-solarized";
import { javascript} from "@codemirror/lang-javascript";
import { cpp} from "@codemirror/lang-cpp";
import { java} from "@codemirror/lang-java";
import { python} from "@codemirror/lang-python";
import { getSocket } from "../lib/Socket";
import { CODE_CHANGE, CODE_SYNC, JOIN, SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA } from "../lib/socketEvents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { executionSourceAPI, runtimesExecutionSourceAPI } from "../utils/config.jsx";
import { setResponseOutput, setIsCodeRunLoading } from "../redux/features/Slices/editorSlice.jsx";
import CodeRunnerOutput from "./CodeRunnerOutput.jsx";
import { toast} from "react-hot-toast";

//------------------------

export default function Editor({ onCodeChangeCurrentCodeForNewJoin, previousCodeRef}){


    const socket = getSocket();
    const { user} = useSelector(state=>state.user);
    const { isCodeRunLoading} = useSelector(state=>state.editor);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [ selectedLanguage, setSelectedLanguage] = useState("javascript"); 
    const [ code, setCode] = useState(`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started. \n\n// Print "Hello, World!" to the console \nconsole.log("Hello, World!");`);

    const languages = [ 
        { value:"javascript", name:"Javascript", version:"1.32.3", language:"javascript", initialContent:`// Welcome to CodeUity! \n// Type your code below, or paste existing code to get started. \n\n// Print "Hello, World!" to the console \nconsole.log("Hello, World!");`}, 
        { value:"python", name:"Python", version:"3.10.0", language:"python", initialContent:`# Welcome to CodeUnity! \n# Type your code below, or paste existing code to get started.\n\n#hello.py\n\n #Print "Hello, World!"\n\nprint("Hello, World!");`}, 
        { value:"java", name:"Java", version:"15.0.2", language:"java", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.java\n\npublic class Hello {\n\t\tpublic static void main(String[] args) {\n\t\t\t\t// Print "Hello, World!"\n\t\t\t\tSystem.out.println("Hello, World!");\n\t\t}\n}`}, 
        { value:"cpp", name:"C++", version:"10.2.0", language:"c++", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.cpp\n\n#include <iostream>\n\nint main() {\n\t\t// Print "Hello, World!"\n\t\tstd::cout << "Hello, World!" << std::endl;\n\t\treturn 0;\n}`},
        { value:"c", name:"C", version:"10.2.0", language:"c", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.c\n\n#include <stdio.h>\n\nint main() {\n\t\t// Print "Hello, World!"\n\t\tprintf("Hello, World!");\n\t\treturn 0;\n}`},
        { value:"csharp", name:"C#", version:"6.12.0", language:"csharp", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.cs\n\nusing System;\n\nclass Hello {\n\t\tstatic void main(String[] args) {\n\t\t\t\t// Print "Hello, World!"\n\t\t\t\tConsole.WriteLine("Hello, World!");\n\t\t}\n}`},

    ];
   
   

    //get selected language
    const getLanguageExtension = () =>{

        const extensions = [];

        if(selectedLanguage==="javascript"){
            extensions.push(javascript());
        }
        else if( selectedLanguage==="python"){
            extensions.push(python());
        }
        else if( selectedLanguage==="java"){
            extensions.push(java());
        }
        else if( selectedLanguage==="cpp"){
            extensions.push(cpp());
        }
        else{
            extensions.push(javascript());
        }

        return extensions;
    }






    
    //initialise or send data to the socket when new user comes( notify others)
    // useEffect(()=>{
    //     if( user.username && user.roomId){
    //         socket.emit(JOIN , { name: user.username, roomId: user.roomId});
    //     }
    //     else{
    //         navigate("/");
    //     }
        
    // },[]);


    //code change
    const codeChange = ( text, e )=>{
        setCode(text);
        socket.emit(CODE_CHANGE, { name: user.username, roomId: user.roomId, code: text});
    
         //i want current code ref for the user who joins right now
            onCodeChangeCurrentCodeForNewJoin(text);
    
    };


    //code sync when new user join the room------------------------
    const codeSyncWhenNewUserJoin = (data)=>{
        if(data.code){
            setCode(data.code);
        }
        
    };

    //when a single user comes first and we have to set the previous stored code data on that room-------------------
    const previousStoredCodeData = (data)=>{

        if(data.previousStoredCode===undefined){
            setCode(`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started. \n\n// Print "Hello, World!" to the console \nconsole.log("Hello, World!");`);
        }
        else{
            setCode(data.previousStoredCode);
        }

        
    }


    //when socket members type code-----------------
    const codeChangingByOther = (data) =>{
        
        if(null===data.code){
            return;
        }

        setCode(data.code);
    };

    useEffect(()=>{

        socket.on(CODE_CHANGE, codeChangingByOther);
        socket.on(CODE_SYNC, codeSyncWhenNewUserJoin);
        socket.on(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, previousStoredCodeData);

        return ()=>{
            socket.off(CODE_CHANGE, codeChangingByOther);
            socket.off(CODE_SYNC, codeSyncWhenNewUserJoin);
            socket.off(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, previousStoredCodeData);
        }

    },[socket]);


    //run code 
    const handleCodeRun = async ()=>{

        dispatch( setIsCodeRunLoading(true));

        let languageExecute  = languages.filter((lang)=>{ return lang.value===selectedLanguage})[0];


        try{
            const res = await axios.post( executionSourceAPI,{
                                                language: languageExecute.language,
                                                version: languageExecute.version,
                                                files:[
                                                    {
                                                        content: code,
                                                    }
                                                ],
                                            })
    
        dispatch( setResponseOutput(res.data));
        dispatch( setIsCodeRunLoading(false));
        }
        catch(err){
            toast.error(err.message);
            dispatch( setIsCodeRunLoading(false));
        }
        
    }



    return(
        <Box sx={{ height:"100%",boxSizing:"border-box", position:"relative"}}>

           {/* language select */}
            <div style={{ height:"50px",zIndex:"3", width:"100%", display:"flex", justifyContent:"end", alignItems:"center"}}>
                
                {/* run code button */}
                <Button onClick={handleCodeRun} sx={{ border:"6px solid red",backgroundColor: "rgb(31, 156, 150)", height:"35px", width:"86px", color:"rgb(2 21 69)", marginRight:"30px", border:"none", borderRadius:"5px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0px 0px 10px 0px rgb(2 21 69)", "&:hover":{backgroundColor:"red", cursor:"pointer", backgroundColor:"black", color:"white", transition:"300ms all"}}} disabled={isCodeRunLoading}>
                        < PlayArrow /><Typography sx={{ fontSize:"18px", fontWeight:"500", cursor:"pointer", marginLeft:"3px"}}>Run</Typography>
                </Button>
                
                {/* select button */}
                <Select value={selectedLanguage} onChange={(e)=>{ setSelectedLanguage(e.target.value); setCode(languages.filter((lang)=>{return lang.value===e.target.value })[0].initialContent );   }} sx={{ boxShadow:"0px 0px 10px 0px rgb(2 21 69)", backgroundColor: "rgb(31, 156, 150)", height:"40px", width:"125px", fontWeight:"600", color:"rgb(2 21 69)", marginRight:"30px", border:"1px solid rgb(2 21 69)"}} MenuProps={{ PaperProps:{ sx: { backgroundColor:"rgb(60, 61, 55)"}}}} disabled={isCodeRunLoading}>
                    {
                        languages.map((lang)=>{
                            return(
                                <MenuItem value={lang.value} sx={{backgroundColor:"rgb(60, 61, 55)", color:"white" , "&:hover":{backgroundColor:"black"}}}>
                                    {lang.name}
                                </MenuItem>
                            )
                        })
                    }
                   
                </Select>
            
            </div>

            {/* code writer */}
            <div style={{overflow:"scroll"}}>
                <CodeMirrorArea onChange={codeChange} value={code}  theme={solarizedDark} className="editorArea" extensions={ getLanguageExtension()} >
                </CodeMirrorArea>
            </div>
                
            {/* code runner */}
            <CodeRunnerOutput/>
        
        </Box>
    )
}