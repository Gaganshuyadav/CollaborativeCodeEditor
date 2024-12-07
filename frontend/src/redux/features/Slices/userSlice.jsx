import { createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        user: "",
        allUsers:[],
    },
    reducers:{
        setCurrentUser:( state, action)=>{
            state.user = action.payload;
        },
        deleteCurrentUser:(state, action)=>{
            state.user = "";
        },
        setAllUsers: (state,action)=>{
            state.allUsers = action.payload;
        }
    }
})

export const { setCurrentUser, deleteCurrentUser, setAllUsers} = userSlice.actions;

export default userSlice.reducer;






