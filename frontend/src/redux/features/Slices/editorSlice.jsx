import { createSlice } from "@reduxjs/toolkit";

const editorSlice = createSlice({
    name:"editor",
    initialState:{
        responseOutput: "",
        isCodeRunLoading: false,
    },
    reducers:{
        setResponseOutput: ( state, action)=>{
            state.responseOutput = action.payload;
        },
        setIsCodeRunLoading: (state, action)=>{
            state.isCodeRunLoading  = action.payload;
        }
    }
})

export const { setResponseOutput, setIsCodeRunLoading } = editorSlice.actions;

export default editorSlice.reducer;



