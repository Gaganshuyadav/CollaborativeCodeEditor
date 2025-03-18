import mongoose,{ Schema} from "mongoose";
import { type } from "os";

const codeSchema = new Schema({
    code:{
        type: String
    },
    selectedLanguage:{
        type: String
    },
    roomId:{
        type: String
    }
})

const Code = mongoose.model("Code",codeSchema);

export { Code};

