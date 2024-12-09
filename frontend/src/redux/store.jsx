import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/Slices/userSlice";
import componentReducer from "./features/Slices/componentSlice";
import editorReducer from "./features/Slices/editorSlice";

const store = configureStore({
    reducer:{
        user: userReducer,
        component: componentReducer,
        editor: editorReducer,
    }
})

export default store;



















