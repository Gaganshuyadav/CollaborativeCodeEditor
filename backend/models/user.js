import mongoose, { Model, Schema} from "mongoose";

const userSchema = new Schema({
    name:{
        type:String,
        required: true,
    },
    roomId:{
        type: String,
        required: true
    },
    socketId:{
        type: String,
        required: true,
    }

},{
    timestamps:true
});


const User = mongoose.model("User", userSchema);

export { User};