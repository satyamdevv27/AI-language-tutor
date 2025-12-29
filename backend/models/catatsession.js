import mongoose from "mongoose";

const catatSessionSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    title:{
        type:String,
        default:"New Session",
    }
}, {timestamps:true}
)

export default mongoose.model("CatatSession", catatSessionSchema);