import mongoose from "mongoose";

const connectionDB = (uri)=>{

    mongoose.connect( uri, { dbName:"Code-Unity"})
    .then(()=>{
        console.log("database connected");
    })
    .catch((err)=>{
        console.log("error in connection with DB");
    })
}

export { connectionDB};