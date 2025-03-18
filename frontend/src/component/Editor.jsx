
import { useState, useEffect, useRef, useCallback} from "react";
//codemirror setup----------
import { Box, Select, MenuItem, Typography, backdropClasses, Button } from "@mui/material";
import { Language, PlayArrow } from "@mui/icons-material";
import CodeMirrorArea from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { EditorView, ViewUpdate} from "@codemirror/view";
import { EditorSelection } from "@uiw/react-codemirror";
import { solarizedDark} from "@uiw/codemirror-theme-solarized";
import { javascript } from "@codemirror/lang-javascript";
import { cpp} from "@codemirror/lang-cpp";
import { java} from "@codemirror/lang-java";
import { python} from "@codemirror/lang-python";
import { csharp} from "@replit/codemirror-lang-csharp";
import { getSocket } from "../lib/Socket";
import { CODE_CHANGE, CODE_SYNC, JOIN, RUN_CODE_TO_GET_OUTPUT, SELECT_DIFFERENT_LANGUAGE, SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA } from "../lib/socketEvents";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { debounce} from "lodash";
import axios from "axios";
import { executionSourceAPI, runtimesExecutionSourceAPI } from "../utils/config.jsx";
import { setResponseOutput, setIsCodeRunLoading } from "../redux/features/Slices/editorSlice.jsx";
import CodeRunnerOutput from "./CodeRunnerOutput.jsx";
import { toast} from "react-hot-toast";
import { autocompletion} from "@codemirror/autocomplete";
import { javascriptSuggestionList, javaSuggestionList, cppSuggestionList, pythonSuggestionList, cSuggestionList, csharpSuggestionList} from "./CodeFeatures/AutoCompleteSuggestionList.jsx";

//------------------------

export default function Editor({ onCodeChangeCurrentCodeForNewJoin, previousCodeRef}){


    const socket = getSocket();
    const { user} = useSelector(state=>state.user);
    const { isCodeRunLoading} = useSelector(state=>state.editor);
    const params = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [ selectedLanguage, setSelectedLanguage] = useState("javascript"); 
    const [ code, setCode] = useState(`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started. \n\n// Print "Hello, World!" to the console \nconsole.log("Hello, World!");`);
    // const CodeCursorPositionRef = useRef(null);
    // const CodeComponentAreaRef = useRef(null);

    const languages = [ 
        { value:"javascript", name:"Javascript", version:"1.32.3", language:"javascript", initialContent:`// Welcome to CodeUity! \n// Type your code below, or paste existing code to get started. \n\n// Print "Hello, World!" to the console \nconsole.log("Hello, World!");`}, 
        { value:"python", name:"Python", version:"3.10.0", language:"python", initialContent:`# Welcome to CodeUnity! \n# Type your code below, or paste existing code to get started.\n\n#hello.py\n\n #Print "Hello, World!"\n\nprint("Hello, World!");`}, 
        { value:"java", name:"Java", version:"15.0.2", language:"java", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.java\n\npublic class Hello {\n\t\tpublic static void main(String[] args) {\n\t\t\t\t// Print "Hello, World!"\n\t\t\t\tSystem.out.println("Hello, World!");\n\t\t}\n}`}, 
        { value:"cpp", name:"C++", version:"10.2.0", language:"c++", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.cpp\n\n#include <iostream>\n\nint main() {\n\t\t// Print "Hello, World!"\n\t\tstd::cout << "Hello, World!" << std::endl;\n\t\treturn 0;\n}`},
        { value:"c", name:"C", version:"10.2.0", language:"c", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.c\n\n#include <stdio.h>\n\nint main() {\n\t\t// Print "Hello, World!"\n\t\tprintf("Hello, World!");\n\t\treturn 0;\n}`},
        { value:"csharp", name:"C#", version:"6.12.0", language:"csharp", initialContent:`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started.\n\n//hello.cs\n\nusing System;\n\nclass Hello {\n\t\tstatic void Main(String[] args) {\n\t\t\t\t// Print "Hello, World!"\n\t\t\t\tConsole.WriteLine("Hello, World!");\n\t\t}\n}`},

    ];
   
       //select language change
       const selectNewLanguage = (e)=>{

        if(selectedLanguage===e.target.value){
            return;
        }

        setSelectedLanguage(e.target.value); 
        setCode(languages.filter((lang)=>{return lang.value===e.target.value })[0].initialContent);

        //emit lanuage to others
        socket.emit(SELECT_DIFFERENT_LANGUAGE, { roomId : params.id, selectedLanguage: e.target.value });
       
    }
      
    
       
const CompletionSource = ( context)=>{

    //------  `/\w*/`: This is a regular expression pattern.
    //------  `\w` matches any word character (equivalent to [a-zA-Z0-9_]).
    //------  `*` means "zero or more" of the preceding element. \w* matches any sequence of word characters, including an empty string.
    const word = context.matchBefore(/\w*/);

    //compare word length
    if(word.from===word.to) return null;

    let suggestions = [];

        if(selectedLanguage==="javascript"){
            suggestions = javascriptSuggestionList;
        }
        else if( selectedLanguage==="python"){
            suggestions = pythonSuggestionList;
        }
        else if( selectedLanguage==="java"){
            suggestions = javaSuggestionList;
        }
        else if( selectedLanguage==="cpp"){
            suggestions = cppSuggestionList;
        }
        else if( selectedLanguage==="c"){
            suggestions = cSuggestionList;
        }
        else if( selectedLanguage==="csharp"){
            suggestions = csharpSuggestionList;
        }
        else{
            suggestions = javascriptSuggestionList;
        }


    return {
        from : word.from,
        options: suggestions,
    }

}


    //get selected language
    const getLanguageExtension = () =>{

        const extensions = [ autocompletion({ override: [CompletionSource]})];

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
        else if( selectedLanguage==="c"){
            extensions.push(cpp());
        }
        else if( selectedLanguage==="csharp"){
            extensions.push(csharp());
        }
        else{
            extensions.push(javascript());
        }

        return extensions;
    }




    
    //initialise or send data to the socket when new user comes( notify others)
    useEffect(()=>{

        if( user.username && user.roomId){
            socket.emit(JOIN , { name: user.username, roomId: user.roomId});
        }
        else{
            navigate("/");
        }

        
    },[]);


    //debouncedCodeChange
    const debouncedCodeChange = debounce(( text, e )=>{
        setCode(text);
        socket.emit(CODE_CHANGE, { name: user.username, roomId: user.roomId, code: text, selectedLanguage});
    
         //i want current code ref for the user who joins right now
            onCodeChangeCurrentCodeForNewJoin({text, selectedLanguage});
    },600);


    //code change
    const codeChange = ( text, e)=>{

        // CodeCursorPositionRef.current = e.view.viewState.state.selection.ranges[0].from;
        // CodeComponentAreaRef.current = e;

        // e.view.dispatch( e.state.update({ selection: EditorSelection.single( Math.min(  e.view.viewState.state.selection.ranges[0].from, code.length ))}));
        
        debouncedCodeChange(text,e);
    };

    //cleanup function to cancel the debounce on unmount
  useEffect(() => {

    return () => {
      debouncedCodeChange.cancel(); // cancel any pending debounced calls
    };

  }, [debouncedCodeChange]); 





    //code sync when new user join the room------------------------
    const codeSyncWhenNewUserJoin = (data)=>{
        if(data.code){
            setCode(data.code);
            setSelectedLanguage(data.selectedLanguage);
        }
        
    };

    //when a single user comes first and we have to set the previous stored code data on that room-------------------
    const previousStoredCodeData = (data)=>{

        if(data.previousStoredCode===null){
            setCode(`// Welcome to CodeUnity! \n// Type your code below, or paste existing code to get started. \n\n// Print "Hello, World!" to the console \nconsole.log("Hello, World!");`);
        }
        else{
            setCode(data.previousStoredCode.code);
            setSelectedLanguage(data.previousStoredCode.selectedLanguage);
        }

        
    }


    //when socket members type code-----------------
    const codeChangingByOther = (data) =>{
        
        if(null===data.code){
            return;
        }

        setCode((prevCode)=>data.code);

        // if(CodeComponentAreaRef.current && CodeCursorPositionRef.current){
        // if(CodeComponentAreaRef.current){

        //     CodeComponentAreaRef.current.view.dispatch( CodeComponentAreaRef.current.state.update({ selection: EditorSelection.single(43)}));
           
        // }

        


    };

    //when difference language is selected-----------------
    const usersSelectDifferentLanguage = ( data)=>{

            setSelectedLanguage(data.selectedLanguage);
            setCode( languages.filter((lang)=>{ return lang.value===data.selectedLanguage})[0].initialContent );
    }
 


    useEffect(()=>{

        socket.on(CODE_CHANGE, codeChangingByOther);
        socket.on(CODE_SYNC, codeSyncWhenNewUserJoin);
        socket.on(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, previousStoredCodeData);
        socket.on(SELECT_DIFFERENT_LANGUAGE, usersSelectDifferentLanguage);

        return ()=>{
            socket.off(CODE_CHANGE, codeChangingByOther);
            socket.off(CODE_SYNC, codeSyncWhenNewUserJoin);
            socket.off(SINGLE_USER_JOIN_AT_STARTING_GIVE_PREVIOUS_DATA, previousStoredCodeData);
            socket.off(SELECT_DIFFERENT_LANGUAGE, usersSelectDifferentLanguage);
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
        <Box sx={{ height:"100%",boxSizing:"border-box", position:"relative", zIndex:"2"}}>

           {/* language select */}
            <div style={{ height:"50px",zIndex:"3", width:"100%", display:"flex", justifyContent:"end", alignItems:"center",position:"relative"}}>
                
                {/* run code button */}
                <Button onClick={handleCodeRun} sx={{ border:"6px solid red",backgroundColor: "rgb(31, 156, 150)", height:{xs:"35px",md:"40px"}, width:"86px", color:"rgb(2 21 69)", marginRight:{ xs:"20px",md:"30px"}, border:"none", borderRadius:"5px", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0px 0px 10px 0px rgb(2 21 69)", "&:hover":{backgroundColor:"red", cursor:"pointer", backgroundColor:"black", color:"white", transition:"300ms all"}}} disabled={isCodeRunLoading}>
                        < PlayArrow /><Typography sx={{ fontSize:"18px", fontWeight:"500", cursor:"pointer", marginLeft:"3px"}}>Run</Typography>
                </Button>
                
                {/* select button */}
                <Select value={selectedLanguage} onChange={selectNewLanguage} sx={{ boxShadow:"0px 0px 10px 0px rgb(2 21 69)", backgroundColor: "rgb(31, 156, 150)", height:{xs:"35px",md:"40px"}, width:"125px", fontWeight:"600", color:"rgb(2 21 69)", marginRight:{xs:"10px",md:"30px"}, border:"1px solid rgb(2 21 69)"}} MenuProps={{ PaperProps:{ sx: { backgroundColor:"rgb(60, 61, 55)"}}}} disabled={isCodeRunLoading}>
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
                <CodeMirrorArea onChange={codeChange} value={code}  theme={solarizedDark} className="editorArea" extensions={ [...getLanguageExtension(), basicSetup] } >
                </CodeMirrorArea>
            </div>
                
            {/* code runner */}
            <CodeRunnerOutput/>
        
        </Box>
    )
}