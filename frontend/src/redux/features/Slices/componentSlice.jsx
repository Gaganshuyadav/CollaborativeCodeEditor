import { createSlice } from "@reduxjs/toolkit";


const componentSlice = createSlice({
    name:"component",
    initialState:{
        isLeaveGroup: false,
    },
    reducers:{
        setIsLeaveGroup: ( state, action)=>{
            state.isLeaveGroup = action.payload;
        },
    },
})


export const { setIsLeaveGroup} = componentSlice.actions;

export default componentSlice.reducer;
