import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/Slices/userSlice";
import componentReducer from "./features/Slices/componentSlice";

const store = configureStore({
    reducer:{
        user: userReducer,
        component: componentReducer,
    }
})

export default store;



















